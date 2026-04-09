import { useState, useEffect } from 'react';

interface CoinAlert {
  id: string;
  contractAddress: string;
  symbol: string;
  name: string;
  chain: string;
  dex: string;
  priceUsd: number;
  marketCapUsd: number;
  volumeUsd24h: number;
  volumeSpike: number;
  liquidityUsd: number;
  holderCount: number | null;
  whaleActivity: string | null;
  rugRiskScore: number;
  suggestedSize: number;
  claudeAnalysis: string | null;
  alertType: string;
  priority: string;
  telegramSent: boolean;
  timestamp: Date;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<CoinAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/coins/alerts');
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);

    return () => clearInterval(interval);
  }, []);

  return { alerts, loading };
}