import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    const balance = await prisma.balance.findFirst();
    const settings = await prisma.settings.findFirst();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      balance: balance ? 'initialized' : 'not initialized',
      settings: settings ? 'configured' : 'not configured',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: String(error),
      },
      { status: 500 }
    );
  }
}