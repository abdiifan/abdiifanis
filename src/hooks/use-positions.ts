import { useState, useEffect } from 'react';

interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  outcomeTitle: string;
  side: string;
  size: number;
  price: number;
  entryTimestamp: Date;
  exitTimestamp: Date | null;
  exitPrice: number | null;
  status: string;
  pnl: number;
  fees: number;
  edgePercent: number;
  claudeReasoning: string | null;
  isRealMoney: boolean;
}

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch('/api/polymarket/positions');
        const data = await res.json();
        setPositions(data);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 10000);

    return () => clearInterval(interval);
  }, []);

  return { positions, loading };
}