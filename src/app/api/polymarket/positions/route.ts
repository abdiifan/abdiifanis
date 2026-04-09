import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const positions = await prisma.polymarketPosition.findMany({
      orderBy: { entryTimestamp: 'desc' },
      take: 50,
    });

    return NextResponse.json(positions);
  } catch (error) {
    console.error('Positions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}