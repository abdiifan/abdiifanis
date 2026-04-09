"use client";

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/dashboard/header";
import BalanceCard from "@/components/dashboard/balance-card";
import CapitalAllocator from "@/components/dashboard/capital-allocator";
import PolymarketTab from "@/components/dashboard/polymarket-tab";
import CoinScannerTab from "@/components/dashboard/coin-scanner-tab";
import PerformanceChart from "@/components/dashboard/performance-chart";
import RiskControls from "@/components/dashboard/risk-controls";
import { useAppStore } from "@/store/app-store";

export default function Dashboard() {
  const { fetchBalance, fetchSettings, startPolling, stopPolling } = useAppStore();

  useEffect(() => {
    // Initial data fetch
    fetchBalance();
    fetchSettings();

    // Start polling for updates every 5 seconds
    startPolling();

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [fetchBalance, fetchSettings, startPolling, stopPolling]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <BalanceCard />
          </div>

          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
        </div>

        {/* Capital Allocator */}
        <div className="mt-6">
          <CapitalAllocator />
        </div>

        {/* Risk Controls */}
        <div className="mt-6">
          <RiskControls />
        </div>

        {/* Main Tabs */}
        <div className="mt-6">
          <Tabs defaultValue="polymarket" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="polymarket">
                Polymarket Trading
              </TabsTrigger>
              <TabsTrigger value="coins">
                Coin Scanner
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="polymarket" className="mt-6">
              <PolymarketTab />
            </TabsContent>
            
            <TabsContent value="coins" className="mt-6">
              <CoinScannerTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}