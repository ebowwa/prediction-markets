# Prediction Market API Explorer

TypeScript services for efficient prediction market API interaction.

**Platforms:** Kalshi + Polymarket

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TypeScript Services                       │
│  ┌─────────────┐                  ┌──────────────────────┐  │
│  │   Kalshi    │                  │     Polymarket       │  │
│  │   :3000     │                  │       :3001          │  │
│  │   RSA Auth  │                  │      No Auth         │  │
│  └─────────────┘                  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**TypeScript Services:** Efficient API handlers, minimal memory footprint

## Quick Start with OrbStack

### 1. Add your Kalshi API credentials

```bash
cp .env.example .env
# Edit .env and add your KALSHI_API_KEY_ID
```

Get API keys at: https://kalshi.com/profile/api

### 2. Add your private key

```bash
# Place your private_key.pem in the secrets directory
cp ~/Downloads/private_key.pem secrets/private_key.pem
```

### 3. Start the services

```bash
orb-compose up --build
```

### 4. View logs

```bash
# Kalshi TypeScript service
orb-compose logs -f kalshi-ts

# Polymarket service (no API key needed!)
orb-compose logs -f polymarket-service
```

## API Endpoints

### Kalshi Service (Port 3000)

| Endpoint | Description | Auth |
|----------|-------------|------|
| `GET /` | Health check | ✅ |
| `GET /api/balance` | Account balance | ✅ |
| `GET /api/markets` | List markets | ✅ |
| `GET /api/markets/:ticker` | Get specific market | ✅ |
| `GET /api/markets/:ticker/orderbook` | Market orderbook | ✅ |
| `GET /api/markets/:ticker/trades` | Market trades history | ✅ |
| `GET /api/orders` | List orders | ✅ |
| `POST /api/orders` | Create order | ✅ |
| `DELETE /api/orders/:id` | Cancel order | ✅ |
| `PUT /api/orders/:id` | Amend order | ✅ |
| `GET /api/events` | List events | ✅ |
| `GET /api/events/:ticker` | Get specific event | ✅ |
| `GET /api/series` | List series | ✅ |
| `GET /api/series/:ticker` | Get specific series | ✅ |
| `GET /api/exchange/status` | Exchange status | ✅ |

### Polymarket Service (Port 3001)

| Endpoint | Description | Auth |
|----------|-------------|------|
| `GET /` | Health check | ❌ |
| `GET /api/markets` | List markets | ❌ |
| `GET /api/markets/:conditionId` | Get specific market | ❌ |
| `GET /api/events` | List events | ❌ |
| `GET /api/events/:slug` | Get specific event | ❌ |
| `GET /api/profiles/:wallet` | **Public profile (P/L, volume!)** | ❌ |
| `GET /api/positions/:wallet` | **Public positions** | ❌ |
| `GET /api/wallet-trades/:wallet` | **Public trade history** | ❌ |
| `GET /api/search` | Search markets | ❌ |
| `GET /api/orderbook/:tokenId` | Order book | ❌ |
| `GET /api/trades/:tokenId` | Trades history | ❌ |
| `GET /api/price/:tokenId` | Current price | ❌ |

## Usage Examples

### Using curl

```bash
# Kalshi: Requires API key and private key
curl http://localhost:3000/api/markets

# Polymarket: No API key needed!
curl http://localhost:3001/api/markets

# Get public profile (Polymarket only!)
curl http://localhost:3001/api/profiles/0x0afc7ce56285bde1fbe3a75efaffdfc86d6530b2
```

### TypeScript Services (local dev)

```bash
# Kalshi service
cd services/kalshi-ts
bun install
bun run dev

# Polymarket service
cd services/polymarket-ts
bun install
bun run dev
```

## Project Structure

```
prediction-markets/
├── services/
│   ├── kalshi-ts/            # Kalshi TypeScript service
│   │   ├── src/
│   │   │   ├── config.ts
│   │   │   ├── kalshi.client.ts
│   │   │   ├── server.ts
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   └── polymarket-ts/        # Polymarket TypeScript service
│       ├── src/
│       │   ├── polymarket.client.ts
│       │   ├── server.ts
│       │   └── index.ts
│       ├── Dockerfile
│       └── package.json
├── secrets/                  # Kalshi API credentials (gitignored)
├── docker-compose.yml
├── docs/
│   ├── CONTRIBUTING.md
│   ├── PLATFORM-COMPARISON.md   # Kalshi vs Polymarket
│   ├── PARTICIPANTS.md          # Market participant visibility
│   └── POLYMARKET.md            # Polymarket integration docs
└── README.md
```

## Resource Efficiency

| Service | Memory | Auth Required |
|---------|--------|---------------|
| Kalshi TS | ~60MB | ✅ RSA key |
| Polymarket TS | ~40MB | ❌ None |

Total: ~100MB

## Key Differences

### Data Visibility

| Data | Kalshi | Polymarket |
|------|--------|------------|
| Market prices | ✅ Public | ✅ Public |
| User P/L | ❌ Private | ✅ **Public by wallet** |
| User positions | ❌ Private | ✅ **Public by wallet** |
| User trades | ❌ Private | ✅ **Public by wallet** |

### API Design

| Aspect | Kalshi | Polymarket |
|--------|--------|------------|
| Authentication | RSA key | **None for public data** |
| Rate limits | Strict | Lenient |
| Real-time | WebSocket (auth) | WebSocket (public) |

## Documentation

- **[Platform Comparison](docs/PLATFORM-COMPARISON.md)** - Kalshi vs Polymarket philosophies
- **[Participant Visibility](docs/PARTICIPANTS.md)** - What market data is available
- **[Polymarket Integration](docs/POLYMARKET.md)** - Polymarket API details
- **[Contributing](docs/CONTRIBUTING.md)** - How to contribute

## License

MIT
