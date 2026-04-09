import { prisma } from '../prisma';
import { askClaude, loadPrompt } from '../anthropic';
import { sendCoinAlert } from '../telegram';
import axios from 'axios';
import { env } from '../env';

export async function runCoinScannerJob() {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings?.coinScannerEnabled) {
      console.log('Coin scanner disabled');
      return;
    }

    // Scan DEX Screener for trending coins
    const dexResponse = await axios.get(`${env.DEX_SCREENER_API_URL}/dex/tokens/trending`);
    const trendingTokens = dexResponse.data?.data || [];

    for (const token of trendingTokens.slice(0, 10)) {
      // Filter based on criteria
      if (token.marketCap > 500000) continue; // Skip if mcap too high
      if (!token.volumeChange24h || token.volumeChange24h < 300) continue; // Skip if volume spike too low

      // Calculate rug risk (simplified)
      const rugRisk = calculateRugRisk(token);
      if (rugRisk > 25) continue; // Skip high rug risk

      // Ask Claude for analysis
      const analysis = await analyzeCoinWithClaude(token);
      
      // Create alert
      const alert = await prisma.coinAlert.create({
        data: {
          contractAddress: token.address,
          symbol: token.symbol,
          name: token.name,
          chain: token.chainId,
          dex: token.dexId,
          priceUsd: token.priceUsd,
          marketCapUsd: token.marketCap,
          volumeUsd24h: token.volume24h,
          volumeSpike: token.volumeChange24h,
          liquidityUsd: token.liquidity?.usd || 0,
          rugRiskScore: rugRisk,
          suggestedSize: Math.min(5, settings.coinMaxSuggestedSize),
          claudeAnalysis: analysis,
          alertType: 'VOLUME_SPIKE',
          priority: rugRisk < 15 ? 'HIGH' : 'MEDIUM',
        },
      });

      // Send Telegram alert
      await sendCoinAlert(
        alert.symbol,
        alert.name,
        alert.chain,
        alert.contractAddress,
        alert.priceUsd,
        alert.marketCapUsd,
        alert.volumeSpike,
        alert.rugRiskScore,
        alert.suggestedSize,
        alert.claudeAnalysis || 'No analysis available'
      );
    }

    console.log('Coin scanner job completed');
  } catch (error) {
    console.error('Coin scanner job error:', error);
    await prisma.systemLog.create({
      data: {
        level: 'ERROR',
        category: 'COIN_SCANNER',
        message: 'Coin scanner job failed',
        data: JSON.stringify({ error: String(error) }),
      },
    });
  }
}

function calculateRugRisk(token: any): number {
  let risk = 50; // Start at medium risk

  // Adjust based on liquidity
  if (token.liquidity?.usd > 50000) risk -= 20;
  else if (token.liquidity?.usd < 10000) risk += 20;

  // Adjust based on holder count
  if (token.holders > 1000) risk -= 15;
  else if (token.holders < 100) risk += 15;

  // Adjust based on age
  const ageHours = (Date.now() - new Date(token.createdAt).getTime()) / (1000 * 60 * 60);
  if (ageHours > 168) risk -= 10; // > 1 week old
  else if (ageHours < 24) risk += 10; // < 1 day old

  return Math.max(0, Math.min(100, risk));
}

async function analyzeCoinWithClaude(token: any): Promise<string> {
  const prompt = `Analyze this cryptocurrency opportunity:

Symbol: ${token.symbol}
Name: ${token.name}
Price: $${token.priceUsd}
Market Cap: $${token.marketCap}
24h Volume: $${token.volume24h}
Volume Change: +${token.volumeChange24h}%
Liquidity: $${token.liquidity?.usd || 'Unknown'}

Provide a brief 2-3 sentence analysis focusing on:
1. Is this a legitimate opportunity or likely a scam?
2. What's the risk/reward profile?
3. Should a micro-capital trader consider this?`;

  try {
    const response = await askClaude(
      'You are an expert cryptocurrency analyst specializing in micro-cap gems and rug pull detection.',
      prompt,
      512
    );
    return response;
  } catch (error) {
    console.error('Claude analysis error:', error);
    return 'Analysis unavailable';
  }
}