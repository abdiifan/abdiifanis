"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export default function BalanceCard() {
  const { balance } = useAppStore();

  if (!balance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const pnlColor = balance.pnlAllTime >= 0 ? "text-green-500" : "text-red-500";
  const pnlIcon = balance.pnlAllTime >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-4xl font-bold">
            ${balance.totalBalance.toFixed(2)}
          </div>
          <div className={`flex items-center gap-1 mt-2 ${pnlColor}`}>
            {pnlIcon}
            <span className="text-sm font-medium">
              ${Math.abs(balance.pnlAllTime).toFixed(2)} All Time
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Polymarket</span>
            <span className="text-sm font-medium">
              ${balance.polymarketBalance.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Coin Trading</span>
            <span className="text-sm font-medium">
              ${balance.coinBalance.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today's P&L</span>
            <Badge variant={balance.pnlToday >= 0 ? "default" : "destructive"}>
              {balance.pnlToday >= 0 ? "+" : ""}${balance.pnlToday.toFixed(2)}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Drawdown</span>
            <Badge variant={balance.dailyDrawdown < 10 ? "secondary" : "destructive"}>
              {balance.dailyDrawdown.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}