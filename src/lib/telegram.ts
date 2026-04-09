import TelegramBot from 'node-telegram-bot-api';
import { env } from './env';

let bot: TelegramBot | null = null;

export function initTelegram() {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.log('⚠️ Telegram not configured');
    return null;
  }

  try {
    bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: false });
    console.log('✅ Telegram bot initialized');
    return bot;
  } catch (error) {
    console.error('Failed to initialize Telegram:', error);
    return null;
  }
}

export async function sendTelegramMessage(message: string, options?: {
  parseMode?: 'HTML' | 'Markdown';
  disablePreview?: boolean;
}): Promise<boolean> {
  if (!bot || !env.TELEGRAM_CHAT_ID) {
    console.log('Telegram not available, skipping message');
    return false;
  }

  try {
    await bot.sendMessage(env.TELEGRAM_CHAT_ID, message, {
      parse_mode: options?.parseMode,
      disable_web_page_preview: options?.disablePreview,
    });
    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

export async function sendPolymarketAlert(
  marketTitle: string,
  outcome: string,
  action: 'BUY' | 'SELL',
  size: number,
  price: number,
  edge: number,
  reasoning: string
) {
  const message = `
🎯 <b>Polymarket Trade Alert</b>

📊 Market: ${marketTitle}
🎲 Outcome: ${outcome}
📈 Action: ${action}
💰 Size: $${size.toFixed(2)}
💵 Price: ${(price * 100).toFixed(1)}¢
⚡ Edge: ${edge.toFixed(1)}%

🤖 Claude's Reasoning:
${reasoning}
  `.trim();

  return sendTelegramMessage(message, { parseMode: 'HTML' });
}

export async function sendCoinAlert(
  symbol: string,
  name: string,
  chain: string,
  contractAddress: string,
  price: number,
  mcap: number,
  volumeSpike: number,
  rugRisk: number,
  suggestedSize: number,
  analysis: string
) {
  const dexUrl = `https://dexscreener.com/${chain}/${contractAddress}`;
  
  const message = `
🚀 <b>Coin Alert: ${symbol}</b>

📛 Name: ${name}
⛓ Chain: ${chain.toUpperCase()}
💵 Price: $${price.toFixed(6)}
💎 MCAP: $${(mcap / 1000).toFixed(0)}k
📊 Volume Spike: +${volumeSpike.toFixed(0)}%
⚠️ Rug Risk: ${rugRisk.toFixed(0)}/100

💰 Suggested Entry: $${suggestedSize.toFixed(2)}

🤖 Claude's Analysis:
${analysis}

🔗 <a href="${dexUrl}">View on DEX Screener</a>
📋 CA: <code>${contractAddress}</code>
  `.trim();

  return sendTelegramMessage(message, { parseMode: 'HTML', disablePreview: false });
}

// Initialize on import
initTelegram();