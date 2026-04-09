"use client";

import { TrendingUp, Bot, Shield } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Claude Dual Profit Bot
          </h1>
          <p className="text-muted-foreground mt-1">
            Autonomous micro-capital trading system
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">System Active</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Protected</span>
        </div>
      </div>
    </div>
  );
}