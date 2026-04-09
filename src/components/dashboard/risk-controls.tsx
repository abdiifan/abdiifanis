"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import { useState } from "react";
import { Shield } from "lucide-react";
import { toast } from "sonner";

export default function RiskControls() {
  const { settings, updateSettings } = useAppStore();
  const [maxPosition, setMaxPosition] = useState(settings?.polymarketMaxPositionPercent || 8);
  const [minEdge, setMinEdge] = useState(settings?.polymarketMinEdgePercent || 12);
  const [maxCoinSize, setMaxCoinSize] = useState(settings?.coinMaxSuggestedSize || 5);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!settings) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateSettings({
        polymarketMaxPositionPercent: maxPosition,
        polymarketMinEdgePercent: minEdge,
        coinMaxSuggestedSize: maxCoinSize,
      });
      toast.success("Risk controls updated");
    } catch (error) {
      toast.error("Failed to update risk controls");
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = 
    maxPosition !== settings.polymarketMaxPositionPercent ||
    minEdge !== settings.polymarketMinEdgePercent ||
    maxCoinSize !== settings.coinMaxSuggestedSize;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Controls
        </CardTitle>
        <CardDescription>
          Adjust position sizing and risk parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Polymarket Max Position */}
          <div className="space-y-3">
            <Label>Polymarket Max Position</Label>
            <div className="text-2xl font-bold">{maxPosition}%</div>
            <Slider
              value={[maxPosition]}
              onValueChange={(value) => setMaxPosition(value[0])}
              min={2}
              max={15}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Maximum % of allocated capital per trade
            </p>
          </div>

          {/* Minimum Edge */}
          <div className="space-y-3">
            <Label>Minimum Edge Required</Label>
            <div className="text-2xl font-bold">{minEdge}%</div>
            <Slider
              value={[minEdge]}
              onValueChange={(value) => setMinEdge(value[0])}
              min={5}
              max={25}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Minimum probability edge after fees
            </p>
          </div>

          {/* Max Coin Suggested Size */}
          <div className="space-y-3">
            <Label>Max Coin Alert Size</Label>
            <div className="text-2xl font-bold">${maxCoinSize}</div>
            <Slider
              value={[maxCoinSize]}
              onValueChange={(value) => setMaxCoinSize(value[0])}
              min={1}
              max={10}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Maximum suggested entry for coin alerts
            </p>
          </div>
        </div>

        <Button 
          onClick={handleUpdate} 
          disabled={isUpdating || !hasChanges}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Save Risk Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}