import { create } from 'zustand';

interface Balance {
  id: number;
  totalBalance: number;
  polymarketBalance: number;
  coinBalance: number;
  pnlToday: number;
  pnlAllTime: number;
  dailyDrawdown: number;
  lastUpdated: Date;
}

interface Settings {
  polymarketEnabled: boolean;
  coinScannerEnabled: boolean;
  polymarketPaperMode: boolean;
  polymarketAllocationPercent: number;
  coinAllocationPercent: number;
  polymarketMaxPositionPercent: number;
  polymarketMinEdgePercent: number;
  coinMaxSuggestedSize: number;
  dailyDrawdownLimit: number;
  telegramEnabled: boolean;
}

interface AppStore {
  balance: Balance | null;
  settings: Settings | null;
  pollingInterval: NodeJS.Timeout | null;
  
  fetchBalance: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  balance: null,
  settings: null,
  pollingInterval: null,

  fetchBalance: async () => {
    try {
      const res = await fetch('/api/balance');
      const data = await res.json();
      set({ balance: data });
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  },

  fetchSettings: async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      set({ settings: data });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  },

  updateSettings: async (updates) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      set({ settings: data });
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },

  startPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) return;

    const interval = setInterval(() => {
      get().fetchBalance();
      get().fetchSettings();
    }, 5000);

    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },
}));