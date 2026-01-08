# Polymarket Integration

This document describes the Polymarket API integration added to this project.

---

## Overview

Polymarket support has been added alongside Kalshi to enable **cross-platform analysis**. This allows you to:

- Compare market data between Kalshi and Polymarket
- Analyze public trader profiles (only available on Polymarket)
- Study the privacy differences between the platforms
- Build unified prediction market analytics tools

---

## Architecture

```
┌─────────────────────┐
│   Polymarket API   │ ← Gamma API (market discovery)
│                     │ ← CLOB API (orderbook/trading)
│                     │ ← Data API (public profiles!)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│  Polymarket TypeScript      │ ← Port 3001
│  Service (Hono)             │ ← Lightweight API wrapper
└──────────┬──────────────────┘
           │ HTTP
           ▼
┌─────────────────────────────┐
│  Python Client              │ ← PolymarketClient class
│  (httpx + pandas)           │ ← Data analysis
└─────────────────────────────┘
```

---

## Services

### Polymarket TypeScript Service (`services/polymarket/`)

**Port:** 3001

**Dependencies:**
- `hono` - Lightweight HTTP framework
- `@polymarket/clob-client` - Official Polymarket SDK (optional, we use fetch directly)

**Endpoints:**
- `GET /` - Health check & API docs
- `GET /api/markets` - List markets (with filters)
- `GET /api/markets/:conditionId` - Get specific market
- `GET /api/events` - List events
- `GET /api/events/:slug` - Get specific event
- `GET /api/profiles/:walletAddress` - **Public profile (P/L, volume, positions!)**
- `GET /api/search` - Search markets, events, profiles
- `GET /api/orderbook/:tokenId` - Order book
- `GET /api/trades/:tokenId` - Trade history
- `GET /api/price/:tokenId` - Current price
- `GET /api/positions/:walletAddress` - **Public positions for a wallet**
- `GET /api/wallet-trades/:walletAddress` - **Public trade history for a wallet**

---

## Key Differences: Polymarket vs Kalshi

### Data Visibility

| Data | Kalshi | Polymarket |
|------|--------|------------|
| **Market prices** | ✅ Public | ✅ Public |
| **Order book** | ✅ Public | ✅ Public |
| **Trade history** | ✅ Aggregated | ✅ Aggregated |
| **User P/L** | ❌ Private | ✅ **Public by wallet** |
| **User positions** | ❌ Private | ✅ **Public by wallet** |
| **User trades** | ❌ Private | ✅ **Public by wallet** |
| **Wallet addresses** | ❌ Hidden | ✅ **Public** |

### API Design

| Aspect | Kalshi | Polymarket |
|--------|--------|------------|
| **Authentication** | RSA key required | **No auth for public data** |
| **Rate limits** | Strict | More lenient |
| **Real-time** | WebSocket (auth required) | WebSocket (public) |
| **User data** | Private only | **Public by wallet address** |

---

## Python Client Usage

```python
from client import PolymarketClient

# Initialize client
with PolymarketClient() as client:
    # Health check
    health = client.health()

    # List active markets
    markets = client.list_markets(limit=10, active=True, order="volume")

    # Get a public profile (e.g., @Rundeep from Polymarket)
    wallet = "0x0afc7ce56285bde1fbe3a75efaffdfc86d6530b2"
    profile = client.get_profile(wallet)
    # Returns: P/L, volume, trades, markets_traded, biggest_win

    # Get public positions for a wallet
    positions = client.get_positions(wallet)

    # Get public trade history for a wallet
    trades = client.get_wallet_trades(wallet, limit=100)

    # Search across markets, events, profiles
    results = client.search("bitcoin")
```

---

## Real Example: Public Profile Data

Using the Polymarket API, you can fetch the same data visible on the @Rundeep profile:

```python
from client import PolymarketClient

wallet = "0x0afc7ce56285bde1fbe3a75efaffdfc86d6530b2"

with PolymarketClient() as client:
    profile = client.get_profile(wallet)

    # Example response (matches the public profile):
    # {
    #   "wallet_address": "0x0afc7ce56285bde1fbe3a75efaffdfc86d6530b2",
    #   "profit_loss": 154219.38,
    #   "volume": 507793.46,
    #   "trades": 127,
    #   "markets_traded": 7,
    #   "biggest_win": 128736.79
    # }
```

**This is impossible on Kalshi** — all user data is private.

---

## Docker Setup

### Build and Start Services

```bash
# Start all services (Kalshi + Polymarket + Python)
docker-compose up -d

# View logs
docker-compose logs -f polymarket-service

# Stop services
docker-compose down
```

### Access Services

- **Polymarket Service:** http://localhost:3001
- **Kalshi Service:** http://localhost:3000
- **Python Client:** `docker-compose exec kalshi-python bash`

---

## Example: Cross-Platform Analysis

```python
from client import KalshiClient, PolymarketClient
import pandas as pd

# Compare market data across platforms
with KalshiClient() as kalshi, PolymarketClient() as poly:
    # Kalshi: Get markets (requires API key)
    kalshi_markets = kalshi.list_markets(limit=50, status="open")

    # Polymarket: Get markets (no API key needed!)
    poly_markets = poly.list_markets(limit=50, active=True)

    # Compare liquidity
    kalshi_df = pd.DataFrame(kalshi_markets["data"]["markets"])
    poly_df = pd.DataFrame(poly_markets["data"]["markets"])

    print(f"Kalshi avg volume: ${kalshi_df['volume'].mean():,.0f}")
    print(f"Polymarket avg volume: ${poly_df['markets'].apply(lambda x: x[0].get('volume', 0)).mean():,.0f}")
```

---

## API Coverage

### ✅ Implemented

- **Gamma API:** Markets, events, profiles, search
- **CLOB API:** Orderbook, trades, prices
- **Data API:** Positions, trade history (by wallet)

### 🔜 Future Additions

- WebSocket subscriptions (real-time price updates)
- Order placement (requires wallet signing)
- CTF operations (token split/merge/redeem)

---

## Why This Matters

The Polymarket integration enables research that's **impossible on Kalshi**:

1. **Social Trading Analysis** - Study successful traders' strategies
2. **Market Efficiency** - Compare "wisdom of the crowd" across platforms
3. **Privacy Research** - Quantify the impact of public vs private trading
4. **Cross-Platform Arbitrage** - Find price discrepancies between platforms

---

## Resources

- **Polymarket Docs:** https://docs.polymarket.com/
- **Gamma API:** https://gamma-api.polymarket.com
- **CLOB API:** https://clob.polymarket.com
- **Platform Comparison:** See `PLATFORM-COMPARISON.md`

---

`★ Insight ─────────────────────────────────────`
- **Polymarket requires NO API keys for public data** — unlike Kalshi's RSA authentication. This makes it ideal for research and analytics.
- **The `/api/profiles/:walletAddress` endpoint** exposes what Kalshi intentionally hides: public P/L, volume, and positions for any wallet address.
- **Cross-platform comparison is now trivial** — both services run in Docker, share the same Python client pattern, and output compatible data structures.
`─────────────────────────────────────────────────`
