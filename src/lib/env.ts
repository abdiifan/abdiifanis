import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string(),
  
  // Anthropic
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  
  // Polymarket
  POLYMARKET_API_KEY: z.string().optional(),
  POLYMARKET_SECRET: z.string().optional(),
  POLYMARKET_PASSPHRASE: z.string().optional(),
  POLYMARKET_WALLET_PRIVATE_KEY: z.string().optional(),
  
  // APIs
  DEX_SCREENER_API_URL: z.string().url().default('https://api.dexscreener.com/latest'),
  BIRDEYE_API_KEY: z.string().optional(),
  BIRDEYE_API_URL: z.string().url().default('https://public-api.birdeye.so'),
  
  // Telegram
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  
  // Config
  INITIAL_BALANCE: z.string().default('25.00'),
  MAX_DAILY_DRAWDOWN_PERCENT: z.string().default('15'),
  POLYMARKET_MAX_POSITION_PERCENT: z.string().default('8'),
  POLYMARKET_MIN_EDGE_PERCENT: z.string().default('12'),
  COIN_SCANNER_MAX_SUGGESTED_SIZE: z.string().default('5'),
  COIN_SCANNER_MAX_MCAP: z.string().default('500000'),
  COIN_SCANNER_MIN_VOLUME_SPIKE_PERCENT: z.string().default('300'),
  COIN_SCANNER_MAX_RUG_RISK_SCORE: z.string().default('25'),
  
  // Intervals
  POLYMARKET_SCAN_INTERVAL: z.string().default('15'),
  COIN_SCAN_INTERVAL: z.string().default('30'),
  BALANCE_CHECK_INTERVAL: z.string().default('60'),
});

export const env = envSchema.parse(process.env);

export const config = {
  initialBalance: parseFloat(env.INITIAL_BALANCE),
  maxDailyDrawdown: parseFloat(env.MAX_DAILY_DRAWDOWN_PERCENT),
  polymarket: {
    maxPositionPercent: parseFloat(env.POLYMARKET_MAX_POSITION_PERCENT),
    minEdgePercent: parseFloat(env.POLYMARKET_MIN_EDGE_PERCENT),
    scanInterval: parseInt(env.POLYMARKET_SCAN_INTERVAL) * 1000,
  },
  coinScanner: {
    maxSuggestedSize: parseFloat(env.COIN_SCANNER_MAX_SUGGESTED_SIZE),
    maxMcap: parseFloat(env.COIN_SCANNER_MAX_MCAP),
    minVolumeSpike: parseFloat(env.COIN_SCANNER_MIN_VOLUME_SPIKE_PERCENT),
    maxRugRisk: parseFloat(env.COIN_SCANNER_MAX_RUG_RISK_SCORE),
    scanInterval: parseInt(env.COIN_SCAN_INTERVAL) * 1000,
  },
  balanceCheckInterval: parseInt(env.BALANCE_CHECK_INTERVAL) * 1000,
};