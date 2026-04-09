"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from "react";

interface PerformanceData {
  timestamp: string;
  totalBalance: number;
  polymarketBalance: number;
  coinBalance: number;
}

export default function PerformanceChart() {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/balance?snapshots=true');
        const json = await res.json();
        setData(json.snapshots || []);
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp" 
                className="text-muted-foreground text-xs"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                className="text-muted-foreground text-xs"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalBalance" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Total"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="polymarketBalance" 
                stroke="#10b981" 
                strokeWidth={1.5}
                name="Polymarket"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="coinBalance" 
                stroke="#f59e0b" 
                strokeWidth={1.5}
                name="Coins"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}