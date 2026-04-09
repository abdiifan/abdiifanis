import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const alerts = await prisma.coinAlert.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Alerts fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}