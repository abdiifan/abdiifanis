"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import { usePositions } from "@/hooks/use-positions";
import { Activity, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function PolymarketTab() {
  const { settings, updateSettings } = useAppStore();
  const { positions, loading } = usePositions();

  if (!settings) return null;

  const openPositions = positions.filter(p => p.status === "OPEN");
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  const handleToggle = async (field: string, value: boolean) => {
    try {
      await updateSettings({ [field]: value });
      toast.success(`${field === 'polymarketEnabled' ? 'Trading' : 'Paper mode'} ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error("Failed to update setting");
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Controls</CardTitle>
          <CardDescription>
            Manage Polymarket trading settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable Trading</Label>
            <Switch
              id="enabled"
              checked={settings.polymarketEnabled}
              onCheckedChange={(checked) => handleToggle('polymarketEnabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="paper">Paper Mode (No Real Money)</Label>
            <Switch
              id="paper"
              checked={settings.polymarketPaperMode}
              onCheckedChange={(checked) => handleToggle('polymarketPaperMode', checked)}
            />
          </div>
          {!settings.polymarketPaperMode && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-500">
                ⚠️ Real money mode active. Trades will use actual funds.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openPositions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Open Positions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Open Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-20 bg-muted rounded" />
              ))}
            </div>
          ) : openPositions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No open positions. Scanner is monitoring markets...
            </div>
          ) : (
            <div className="space-y-3">
              {openPositions.map(position => (
                <div 
                  key={position.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium">{position.marketTitle}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {position.outcomeTitle}
                      </div>
                    </div>
                    <Badge variant={position.side === 'BUY' ? 'default' : 'secondary'}>
                      {position.side}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Size</div>
                      <div className="font-medium">${position.size.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Price</div>
                      <div className="font-medium">{(position.price * 100).toFixed(1)}¢</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Edge</div>
                      <div className="font-medium text-green-500">
                        {position.edgePercent.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">P&L</div>
                      <div className={`font-medium ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${position.pnl.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {position.claudeReasoning && (
                    <div className="mt-3 p-2 bg-muted rounded text-xs text-muted-foreground">
                      <strong>Claude:</strong> {position.claudeReasoning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse h-16 bg-muted rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {positions.slice(0, 5).map(position => (
                <div 
                  key={position.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{position.marketTitle}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(position.entryTimestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {position.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}