import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Initialize database with default values
export async function initializeDatabase() {
  try {
    // Check if balance exists
    const balance = await prisma.balance.findFirst();
    if (!balance) {
      const initialBalance = parseFloat(process.env.INITIAL_BALANCE || '25.00');
      await prisma.balance.create({
        data: {
          totalBalance: initialBalance,
          polymarketBalance: initialBalance * 0.6,
          coinBalance: initialBalance * 0.4,
          pnlToday: 0,
          pnlAllTime: 0,
          dailyDrawdown: 0,
        },
      });
    }

    // Check if settings exist
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      await prisma.settings.create({
        data: {
          polymarketEnabled: true,
          coinScannerEnabled: true,
          polymarketPaperMode: true,
          polymarketAllocationPercent: 60,
          coinAllocationPercent: 40,
          polymarketMaxPositionPercent: 8,
          polymarketMinEdgePercent: 12,
          coinMaxSuggestedSize: 5,
          dailyDrawdownLimit: 15,
          telegramEnabled: true,
        },
      });
    }

    console.log('✅ Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}