"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { useAlerts } from "@/hooks/use-alerts";
import { AlertCircle, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

export default function CoinScannerTab() {
  const { settings, updateSettings } = useAppStore();
  const { alerts, loading } = useAlerts();

  if (!settings) return null;

  const handleToggle = async (value: boolean) => {
    try {
      await updateSettings({ coinScannerEnabled: value });
      toast.success(`Coin scanner ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error("Failed to update setting");
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const highPriorityAlerts = alerts.filter(a => a.priority === 'HIGH');

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Scanner Controls</CardTitle>
          <CardDescription>
            Manage crypto moonshot scanning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="scanner-enabled">Enable Scanner</Label>
            <Switch
              id="scanner-enabled"
              checked={settings.coinScannerEnabled}
              onCheckedChange={handleToggle}
            />
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-500">
              ℹ️ Scanner provides alerts only. All trades must be executed manually.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {highPriorityAlerts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter(a => 
                new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Live Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-32 bg-muted rounded" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No alerts yet. Scanner is monitoring DEXs...
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {alerts.map(alert => (
                <div 
                  key={alert.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{alert.symbol}</span>
                        <Badge variant={
                          alert.priority === 'HIGH' ? 'destructive' : 
                          alert.priority === 'MEDIUM' ? 'default' : 'secondary'
                        }>
                          {alert.priority}
                        </Badge>
                        <Badge variant="outline">{alert.chain.toUpperCase()}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{alert.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Price</div>
                      <div className="font-medium">${alert.priceUsd.toFixed(6)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">MCAP</div>
                      <div className="font-medium">
                        ${(alert.marketCapUsd / 1000).toFixed(0)}k
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Volume Spike</div>
                      <div className="font-medium text-green-500">
                        +{alert.volumeSpike.toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Rug Risk</div>
                      <div className={`font-medium ${
                        alert.rugRiskScore < 25 ? 'text-green-500' : 
                        alert.rugRiskScore < 50 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {alert.rugRiskScore.toFixed(0)}/100
                      </div>
                    </div>
                  </div>

                  {alert.claudeAnalysis && (
                    <div className="p-3 bg-muted rounded text-sm mb-3">
                      <strong className="text-primary">Claude Analysis:</strong>
                      <p className="mt-1 text-muted-foreground">{alert.claudeAnalysis}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">
                      Suggested: ${alert.suggestedSize.toFixed(2)}
                    </Badge>
                    <Badge variant="outline">{alert.alertType}</Badge>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyAddress(alert.contractAddress)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy CA
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a 
                        href={`https://dexscreener.com/${alert.chain}/${alert.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        DEX Screener
                      </a>
                    </Button>
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