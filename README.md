# 🚀 Claude Dual Micro-Capital Profit Bot

A production-ready autonomous trading system combining **Polymarket arbitrage** and **crypto moonshot scanning**, powered by Claude AI's decision-making engine. Designed for micro-capital ($25 starting balance) with institutional-grade risk management.

## 🎯 Features

### Dual Strategy System
- **Polymarket Arbitrage**: Automated trading on high-probability events with 12-15% minimum edge
- **Crypto Moonshot Scanner**: Real-time alerts for early 5x-10x opportunities on Solana, Base, and Ethereum

### Intelligent Capital Management
- Shared $25 balance with dynamic allocation
- Position sizing: 4-8% per Polymarket trade, $1-5 suggested for coins
- Auto-scaling as balance grows
- Daily drawdown protection (10-15% limit)

### Claude-Powered Decision Engine
- Every Polymarket trade analyzed and approved by Claude
- Risk scoring for coin opportunities
- Probability calculations with edge detection
- Natural language reasoning for all decisions

### Professional Dashboard
- Real-time balance tracking with performance charts
- Live position monitoring and PNL history
- Capital allocation slider with instant rebalancing
- Paper/real mode toggle per strategy
- Dark mode UI with shadcn/ui components

### 24/7 Autonomous Operation
- Background job system via Next.js API routes
- 15-second Polymarket scanning
- 30-second coin scanning
- Telegram alerts for opportunities and trades
- Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Anthropic API key (Claude)
- Polymarket account with API credentials
- Birdeye API key (for enhanced crypto data)
- Telegram bot token (for alerts)

## 🛠️ Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/claude-dual-profit-bot.git
   cd claude-dual-profit-bot
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
```

4. **Initialize database**
```bash
   npx prisma generate
   npx prisma db push
```

5. **Run development server**
```bash
   npm run dev
```

   Dashboard will be available at `http://localhost:3000`

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Important**: Set up a cron job to ping `/api/cron` every minute:
```bash
# Use a service like cron-job.org or EasyCron
GET https://your-app.vercel.app/api/cron
```

### Option 2: VPS/Dedicated Server
1. Build the application:
```bash
   npm run build
```

2. Start with PM2:
```bash
   npm install -g pm2
   pm2 start npm --name "profit-bot" -- start
   pm2 startup
   pm2 save
```

3. Set up nginx reverse proxy (optional):
```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
```

## 📊 Usage Guide

### Initial Setup
1. **Configure API Keys**: Add all required keys to `.env`
2. **Set Starting Balance**: Default is $25 (configurable)
3. **Allocate Capital**: Use dashboard slider to split between strategies
4. **Choose Mode**: Toggle paper/real trading per strategy
5. **Adjust Risk**: Set max position sizes and edge requirements

### Monitoring
- **Dashboard**: Real-time view of all positions and alerts
- **Telegram**: Instant notifications for trades and opportunities
- **Database**: Query `prisma/dev.db` for historical analysis

### Risk Controls
- Maximum position size per trade (configurable)
- Minimum edge requirement for Polymarket (12-15%)
- Daily drawdown limit (10-15% auto-pause)
- Rug risk scoring for coin alerts (<25 score required)
- Blacklist support for avoiding bad actors

## 🔧 Configuration

Edit `.env` to customize:

```bash
# Core Settings
INITIAL_BALANCE=25.00              # Starting capital
MAX_DAILY_DRAWDOWN_PERCENT=15      # Daily loss limit

# Polymarket Strategy
POLYMARKET_MAX_POSITION_PERCENT=8  # Max 8% per trade
POLYMARKET_MIN_EDGE_PERCENT=12     # Minimum 12% edge

# Coin Scanner Strategy
COIN_SCANNER_MAX_SUGGESTED_SIZE=5  # Max $5 suggestion
COIN_SCANNER_MAX_MCAP=500000       # Only < $500k mcap
COIN_SCANNER_MIN_VOLUME_SPIKE_PERCENT=300  # 300%+ volume spike
COIN_SCANNER_MAX_RUG_RISK_SCORE=25 # Low rug risk only

# Scanning Intervals
POLYMARKET_SCAN_INTERVAL=15        # Scan every 15 seconds
COIN_SCAN_INTERVAL=30              # Scan every 30 seconds
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (easily swappable to PostgreSQL)
- **AI**: Anthropic Claude 3.5 Sonnet
- **State**: Zustand for global state management
- **Trading**: @polymarket/clob-client, ethers.js
- **Data**: DEX Screener API, Birdeye API v2

### Project Structure
src/
├── app/              # Next.js App Router
│   ├── api/          # API routes (REST + background jobs)
│   └── page.tsx      # Dashboard UI
├── components/       # React components
│   ├── ui/           # shadcn/ui primitives
│   └── dashboard/    # Feature components
├── lib/              # Core business logic
│   ├── polymarket/   # Polymarket integration
│   ├── coins/        # Crypto scanning
│   ├── risk/         # Risk management
│   ├── prompts/      # Claude system prompts
│   └── jobs/         # Background job logic
├── hooks/            # React hooks
└── store/            # Zustand stores
## 🔐 Security Best Practices

1. **Never commit `.env`** - Use `.env.example` as template
2. **API Keys**: Store securely, rotate regularly
3. **Private Keys**: Use hardware wallets in production
4. **Rate Limiting**: Implemented on all external API calls
5. **Input Validation**: Zod schemas on all user inputs
6. **Error Handling**: Comprehensive try-catch with logging

## 📈 Performance Optimization

- **Caching**: API responses cached when appropriate
- **Debouncing**: User input debounced to reduce API calls
- **Lazy Loading**: Components loaded on demand
- **Database Indexing**: Optimized queries with proper indexes
- **Batch Operations**: Multiple trades/alerts processed in batches

## 🐛 Troubleshooting

### Jobs not running
- Ensure `/api/cron` is being pinged regularly
- Check logs for errors: `pm2 logs profit-bot`
- Verify environment variables are set

### Polymarket trades failing
- Confirm API credentials are correct
- Check wallet has sufficient USDC balance
- Verify network connectivity

### Telegram alerts not sending
- Validate bot token and chat ID
- Ensure bot is added to chat
- Check Telegram API rate limits

### Database errors
- Run `npx prisma generate` after schema changes
- Check file permissions on `dev.db`
- Consider migrating to PostgreSQL for production

## 📝 Development

### Adding new features
1. Create feature branch: `git checkout -b feature/name`
2. Update Prisma schema if needed: `npx prisma db push`
3. Add tests for critical paths
4. Submit PR with description

### Database migrations
```bash
npx prisma migrate dev --name description
npx prisma generate
```

### Viewing database
```bash
npx prisma studio
```

## 📄 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This software is for educational purposes. Trading crypto and prediction markets involves substantial risk. Never trade with money you can't afford to lose. Past performance does not guarantee future results. Always do your own research.

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📞 Support

- Issues: [GitHub Issues](https://github.com/yourusername/claude-dual-profit-bot/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/claude-dual-profit-bot/discussions)

---

Built with ❤️ using Claude AI, Next.js, and modern web technologies.