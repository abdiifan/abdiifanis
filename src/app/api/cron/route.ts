import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/prisma';
import { runPolymarketJob } from '@/lib/jobs/polymarket-job';
import { runCoinScannerJob } from '@/lib/jobs/coin-scanner-job';

let lastPolymarketRun = 0;
let lastCoinScanRun = 0;
let isInitialized = false;

export async function GET() {
  try {
    // Initialize database on first run
    if (!isInitialized) {
      await initializeDatabase();
      isInitialized = true;
    }

    const now = Date.now();
    const results = [];

    // Run Polymarket job every 15 seconds
    if (now - lastPolymarketRun > 15000) {
      try {
        await runPolymarketJob();
        lastPolymarketRun = now;
        results.push('Polymarket job completed');
      } catch (error) {
        console.error('Polymarket job error:', error);
        results.push(`Polymarket job failed: ${error}`);
      }
    }

    // Run Coin Scanner job every 30 seconds
    if (now - lastCoinScanRun > 30000) {
      try {
        await runCoinScannerJob();
        lastCoinScanRun = now;
        results.push('Coin scanner job completed');
      } catch (error) {
        console.error('Coin scanner job error:', error);
        results.push(`Coin scanner job failed: ${error}`);
      }
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}