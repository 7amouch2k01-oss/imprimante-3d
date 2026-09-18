import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. Check database connection & measure latency
    const dbPingStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - dbPingStart;

    // 2. Query basic metrics to verify schema integrity
    const [userCount, productCount, waitlistCount] = await Promise.all([
      db.user.count(),
      db.product.count(),
      db.recyclingWaitlist.count(),
    ]);

    const totalLatencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          status: 'connected',
          latencyMs: dbLatencyMs,
        },
        metrics: {
          userCount,
          productCount,
          waitlistCount,
        },
        durationMs: totalLatencyMs,
        environment: process.env.NODE_ENV || 'development',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Health check failure:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
          error: error instanceof Error ? error.message : 'Database ping failure',
        },
        uptime: process.uptime(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
