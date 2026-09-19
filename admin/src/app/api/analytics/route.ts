import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import CustomRequest from '@/lib/models/CustomRequest';
import Product from '@/lib/models/Product';
import Review from '@/lib/models/Review';

export async function GET() {
  try {
    await dbConnect();

    // 1. Core metric counts
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomRequests,
      pendingCustomRequests,
      totalProducts,
      lowStockProducts,
      totalReviews,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ status: 'PENDING' }),
      Order.countDocuments({ status: 'COMPLETED' }),
      CustomRequest.countDocuments({}),
      CustomRequest.countDocuments({ status: 'PENDING' }),
      Product.countDocuments({}),
      Product.countDocuments({ stock: { $lte: 3 } }),
      Review.countDocuments({}),
    ]);

    // 2. Revenue calculation
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ['$totalAmount', '$total'] } },
          averageOrderValue: { $avg: { $ifNull: ['$totalAmount', '$total'] } },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const averageOrderValue = revenueAgg[0]?.averageOrderValue || 0;

    // 3. Category distribution (Products per category)
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 4. Custom Requests by status
    const customStats = await CustomRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 5. Review score average & star distribution
    const reviewsAgg = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const starDistribution = await Review.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    // 6. Recent 7 orders for transaction trends
    const recentTransactions = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderNumber customerName shippingAddress totalAmount total status createdAt')
      .lean();

    return NextResponse.json({
      summary: {
        totalRevenue,
        averageOrderValue,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalCustomRequests,
        pendingCustomRequests,
        totalProducts,
        lowStockProducts,
        totalReviews,
        averageRating: reviewsAgg[0]?.avgRating || 5.0,
      },
      categoryStats,
      customStats,
      starDistribution,
      recentTransactions,
    });
  } catch (err: any) {
    console.error('Analytics API error:', err);
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}
