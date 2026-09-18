import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    return NextResponse.json({
      status: 'ok',
      db: dbStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { status: 'error', db: 'disconnected', error: String(error) },
      { status: 503 }
    );
  }
}
