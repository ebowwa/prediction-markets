# Prediction Market API Explorer

TypeScript services for efficient prediction market API interaction powered by Bun.

**Platforms:** Kalshi + Polymarket

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Bun + TypeScript                         │
│  ┌─────────────┐                  ┌──────────────────────┐  │
│  │   Kalshi    │                  │     Polymarket       │  │
│  │   :3000     │                  │       :3001          │  │
│  │   RSA Auth  │                  │      No Auth         │  │
│  └─────────────┘                  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Powered by Bun:** All-in-one runtime, package manager, test runner, and bundler

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
# Kalshi service
orb-compose logs -f kalshi-ts

# Polymarket service (no API key needed!)
orb-compose logs -f polymarket-service
```

## Local Development with Bun

### Prerequisites

```bash
# Install Bun (macOS/Linux)
curl -fsSL https://bun.sh/install | bash

# Or with Homebrew
brew install oven-sh/bun/bun
```

### Kalshi Service

```bash
cd services/kalshi-ts
bun install
bun run dev       # Hot reload enabled
bun run build     # Minified production build
bun run test      # Run tests
bun run typecheck # TypeScript type checking
```

### Polymarket Service

```bash
cd services/polymarket-ts
bun install
bun run dev       # Hot reload enabled
bun run build     # Minified production build
bun run test      # Run tests
bun run typecheck # TypeScript type checking
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
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── polymarket-ts/        # Polymarket TypeScript service
│       ├── src/
│       │   ├── polymarket.client.ts
│       │   ├── server.ts
│       │   └── index.ts
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── bunfig.toml               # Bun configuration
├── secrets/                  # Kalshi API credentials (gitignored)
├── docker-compose.yml
├── docs/
│   ├── CONTRIBUTING.md
│   ├── PLATFORM-COMPARISON.md
│   ├── PARTICIPANTS.md
│   └── POLYMARKET.md
└── README.md
```

## Resource Efficiency

| Service | Memory | Auth Required |
|---------|--------|---------------|
| Kalshi TS | ~50MB | ✅ RSA key |
| Polymarket TS | ~35MB | ❌ None |

Total: ~85MB (Bun runtime is lighter than Node)

## Bun Features Used

- **Package Manager:** Fast installs with `bun.lock`
- **Runtime:** Optimized JavaScript/TypeScript execution
- **Bundler:** Production builds with tree-shaking and minification
- **Test Runner:** Built-in test framework (`bun test`)
- **Hot Reload:** `bun --hot` for development
- **TypeScript:** Native TS support with no build step for dev

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
