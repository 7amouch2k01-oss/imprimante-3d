import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/security';
import { checkoutSchema } from '@/lib/validations';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Rate limiting: 15 checkout attempts per minute per IP
    const rateCheck = rateLimit(`checkout:${ip}`, 15, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many checkout attempts. Please wait.',
          retryAfter: rateCheck.reset,
        },
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
        {
          error: 'Invalid checkout payload',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, shippingAddress, items } = parsed.data;

    // Fetch products from database and verify stock
    let calculatedTotal = 0;
    const orderItemsData: { productId: string; quantity: number; unitPrice: number }[] = [];
    const stripeLineItems: any[] = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        include: { translations: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} was not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        const prodName = product.translations[0]?.name || product.slug;
        return NextResponse.json(
          { error: `Insufficient stock for product "${prodName}". Available: ${product.stock}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      const productName =
        product.translations.find((t) => t.languageCode === 'en')?.name ||
        product.translations[0]?.name ||
        product.slug;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });

      stripeLineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: productName,
            metadata: {
              productId: product.id,
              slug: product.slug,
              category: product.category,
            },
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    const orderNumber = `CBV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let stripeSessionUrl: string | null = null;
    let stripeSessionId: string | null = null;

    if (isStripeConfigured && stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: customerEmail,
        line_items: stripeLineItems,
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_number=${orderNumber}`,
        cancel_url: `${appUrl}/checkout/cancelled?order_number=${orderNumber}`,
        metadata: {
          orderNumber,
          customerName,
        },
      });

      stripeSessionId = session.id;
      stripeSessionUrl = session.url;
    } else {
      // Development simulated session
      stripeSessionId = `cs_test_cbv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      stripeSessionUrl = `${appUrl}/checkout/success?session_id=${stripeSessionId}&order_number=${orderNumber}&mock=true`;
    }

    // Create order with order items in database transaction
    const newOrder = await db.$transaction(async (tx) => {
      // Deduct stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          shippingAddress: JSON.stringify(shippingAddress),
          totalAmount: parseFloat(calculatedTotal.toFixed(2)),
          currency: 'EUR',
          status: 'PENDING',
          paymentStatus: isStripeConfigured ? 'PENDING' : 'PAID',
          paymentMethod: 'STRIPE',
          stripeSessionId,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  translations: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.orderNumber,
      orderId: newOrder.id,
      totalAmount: newOrder.totalAmount,
      currency: newOrder.currency,
      stripeSessionId,
      checkoutUrl: stripeSessionUrl,
      order: newOrder,
      message: 'Stripe checkout session initialized successfully',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
