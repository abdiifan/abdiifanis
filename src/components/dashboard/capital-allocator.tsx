"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { useState } from "react";
import { toast } from "sonner";

export default function CapitalAllocator() {
  const { settings, balance, updateSettings } = useAppStore();
  const [allocation, setAllocation] = useState(settings?.polymarketAllocationPercent || 60);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!settings || !balance) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateSettings({
        polymarketAllocationPercent: allocation,
        coinAllocationPercent: 100 - allocation,
      });
      toast.success("Capital allocation updated");
    } catch (error) {
      toast.error("Failed to update allocation");
    } finally {
      setIsUpdating(false);
    }
  };

  const polymarketAmount = (balance.totalBalance * allocation) / 100;
  const coinAmount = (balance.totalBalance * (100 - allocation)) / 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Allocation</CardTitle>
        <CardDescription>
          Distribute your ${balance.totalBalance.toFixed(2)} between strategies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Polymarket</span>
            <span className="text-sm text-muted-foreground">
              {allocation}% (${polymarketAmount.toFixed(2)})
            </span>
          </div>
          <Slider
            value={[allocation]}
            onValueChange={(value) => setAllocation(value[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Coin Scanner</span>
            <span className="text-sm text-muted-foreground">
              {100 - allocation}% (${coinAmount.toFixed(2)})
            </span>
          </div>
        </div>

        <Button 
          onClick={handleUpdate} 
          disabled={isUpdating || allocation === settings.polymarketAllocationPercent}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Apply Allocation"}
        </Button>
      </CardContent>
    </Card>
  );
}