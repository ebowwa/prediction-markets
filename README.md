# Prediction Market API Explorer

Hybrid architecture for efficient prediction market API interaction with Python analysis capabilities.

**Platforms:** Kalshi + Polymarket

## Architecture

```
┌─────────────────┐         ┌─────────────────────────────┐
│   Python        │ ◄─────► │   TypeScript Services       │
│                 │  HTTP   │                             │
│ • pandas        │         │ ┌─────────┬────────────────┐ │
│ • numpy        │         │ │ Kalshi  │  Polymarket    │ │
│ • backtesting  │         │ │ :3000   │  :3001         │ │
│ • comparison   │         │ │ RSA     │  No Auth       │ │
└─────────────────┘         │ └─────────┴────────────────┘ │
                            └─────────────────────────────┘
```

**TypeScript Services:** Efficient API handlers, minimal memory footprint
**Python Client:** Data analysis, cross-platform comparison, backtesting

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

# Python client
orb-compose logs -f kalshi-python
```

## API Endpoints

### Kalshi Service (Port 3000)

| Endpoint | Description | Auth |
|----------|-------------|------|
| `GET /` | Health check | ✅ |
| `GET /api/balance` | Account balance | ✅ |
| `GET /api/markets` | List markets | ✅ |
| `GET /api/markets/:ticker` | Get specific market | ✅ |
| `GET /api/orders` | List orders | ✅ |

### Polymarket Service (Port 3001)

| Endpoint | Description | Auth |
|----------|-------------|------|
| `GET /` | Health check | ❌ |
| `GET /api/markets` | List markets | ❌ |
| `GET /api/profiles/:wallet` | **Public profile (P/L, volume!)** | ❌ |
| `GET /api/positions/:wallet` | **Public positions** | ❌ |
| `GET /api/wallet-trades/:wallet` | **Public trade history** | ❌ |

## Usage Examples

### Cross-Platform Analysis

```python
from client import KalshiClient, PolymarketClient

with KalshiClient() as kalshi, PolymarketClient() as poly:
    # Kalshi: Requires API key
    kalshi_markets = kalshi.list_markets(limit=50)

    # Polymarket: No API key needed!
    poly_markets = poly.list_markets(limit=50)

    # Compare liquidity
    print(f"Kalshi markets: {len(kalshi_markets['data']['markets'])}")
    print(f"Polymarket markets: {len(poly_markets['data']['markets'])}")

    # Get public profile (Polymarket only!)
    profile = poly.get_profile("0x0afc7ce56285bde1fbe3a75efaffdfc86d6530b2")
    print(f"Public P/L: ${profile['data']['profile'].get('profit_loss', 0):,.2f}")
```

### Direct Python (without Docker)

```bash
cd services/python
uv pip install -e .
python src/main.py           # Kalshi demo
python src/polymarket_demo.py  # Polymarket demo
```

### TypeScript Services (local dev)

```bash
# Kalshi service
cd services/kalshi-ts
npm install
npm run dev

# Polymarket service
cd services/polymarket-ts
npm install
npm run dev
```

### Jupyter Notebook

```bash
orb-compose run kalshi-python jupyter notebook --ip 0.0.0.0 --port 8888
```

Open `http://localhost:8888` in your browser.

## Project Structure

```
prediction-markets/
├── services/
│   ├── kalshi-ts/            # Kalshi TypeScript service
│   │   ├── src/
│   │   │   ├── config.ts
│   │   │   ├── kalshi.client.ts
│   │   │   └── server.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── polymarket-ts/        # Polymarket TypeScript service
│   │   ├── src/
│   │   │   ├── polymarket.client.ts
│   │   │   ├── server.ts
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   └── python/              # Unified analysis client (both platforms)
│       ├── src/
│       │   ├── client.py    # KalshiClient + PolymarketClient
│       │   ├── analysis.py
│       │   ├── main.py
│       │   └── polymarket_demo.py
│       ├── notebooks/
│       │   └── analysis.ipynb
│       └── Dockerfile
├── secrets/                 # Kalshi API credentials (gitignored)
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
| Python | ~80MB | Varies |

Total: ~180MB for full stack

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
