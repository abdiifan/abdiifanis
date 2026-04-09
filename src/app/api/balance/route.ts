import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSnapshots = searchParams.get('snapshots') === 'true';

    const balance = await prisma.balance.findFirst({
      orderBy: { lastUpdated: 'desc' },
    });

    if (!balance) {
      return NextResponse.json({ error: 'Balance not found' }, { status: 404 });
    }

    if (includeSnapshots) {
      const snapshots = await prisma.performanceSnapshot.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
      });

      return NextResponse.json({
        ...balance,
        snapshots: snapshots.reverse(),
      });
    }

    return NextResponse.json(balance);
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}