import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import { rateLimit } from '@/lib/security';
import { checkoutSchema } from '@/lib/validations';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = rateLimit(`checkout:${ip}`, 15, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please wait.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.reset),
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': String(rateCheck.remaining),
          },
        }
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout payload', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, shippingAddress, items } = parsed.data;

    await connectDB();

    // Fetch products and verify stock
    let calculatedTotal = 0;
    const orderItems: {
      productId: mongoose.Types.ObjectId;
      slug: string;
      name: string;
      quantity: number;
      unitPrice: number;
    }[] = [];
    const stripeLineItems: {
      price_data: {
        currency: string;
        product_data: { name: string };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    for (const item of items) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(item.productId);
      const product = await Product.findOne(
        isValidObjectId
          ? { $or: [{ _id: item.productId }, { slug: item.productId }] }
          : { slug: item.productId }
      );

      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.productId}" not found` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.slug}". Available: ${product.stock}` },
          { status: 409 }
        );
      }

      const activeTr =
        product.translations.find((t) => t.languageCode === 'en') ||
        product.translations[0];

      calculatedTotal += product.price * item.quantity;
      orderItems.push({
        productId: product._id as mongoose.Types.ObjectId,
        slug: product.slug,
        name: activeTr?.name || product.slug,
        quantity: item.quantity,
        unitPrice: product.price,
      });
      stripeLineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: activeTr?.name || product.slug },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    // Generate order number
    const orderNumber = `CBV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Deduct stock
    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(orderItem.productId, {
        $inc: { stock: -orderItem.quantity },
      });
    }

    // Create order
    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      shippingAddress,
      totalAmount: calculatedTotal,
      currency: 'EUR',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: isStripeConfigured ? 'STRIPE' : 'MOCK',
      items: orderItems,
    });

    // Stripe checkout
    if (isStripeConfigured && stripe) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: stripeLineItems,
        mode: 'payment',
        success_url: `${appUrl}/checkout/success?order=${orderNumber}`,
        cancel_url: `${appUrl}/checkout/cancel`,
        customer_email: customerEmail,
        metadata: { orderNumber, orderId: String(order._id) },
      });

      await Order.findByIdAndUpdate(order._id, { stripeSessionId: session.id });

      return NextResponse.json({
        success: true,
        orderNumber,
        checkoutUrl: session.url,
        totalAmount: calculatedTotal,
        order,
      });
    }

    // Mock payment mode
    return NextResponse.json({
      success: true,
      orderNumber,
      checkoutUrl: `/checkout/success?order=${orderNumber}`,
      totalAmount: calculatedTotal,
      mock: true,
      order,
    });
  } catch (error) {
    console.error('POST /api/checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
