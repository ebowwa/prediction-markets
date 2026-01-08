# Kalshi API Explorer

Hybrid architecture for efficient Kalshi API interaction with Python analysis capabilities.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Python        │ ◄─────► │   TypeScript    │
│                 │  HTTP   │                 │
│ • pandas        │         │ • ~60MB RAM     │
│ • numpy        │         │ • Kalshi SDK    │
│ • backtesting  │         │ • REST API      │
└─────────────────┘         └─────────────────┘
```

**TypeScript Service:** Efficient feed handler, minimal memory footprint
**Python Client:** Data analysis, backtesting, strategy development

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
# TypeScript service
orb-compose logs -f kalshi-ts

# Python client
orb-compose logs -f kalshi-python
```

## API Endpoints (TypeScript Service)

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `GET /api/balance` | Account balance |
| `GET /api/markets` | List markets |
| `GET /api/markets/:id` | Get specific market |
| `GET /api/exchange/status` | Exchange status |

## Usage Examples

### Direct Python (without Docker)

```bash
cd services/python
uv pip install -e .
python src/main.py
```

### TypeScript Service (local dev)

```bash
cd services/typescript
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
kalshi-api-explorer/
├── services/
│   ├── typescript/          # Feed handler service
│   │   ├── src/
│   │   │   ├── config.ts
│   │   │   ├── kalshi.client.ts
│   │   │   └── server.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   └── python/              # Analysis client
│       ├── src/
│       │   ├── client.py
│       │   ├── analysis.py
│       │   └── main.py
│       ├── notebooks/
│       │   └── analysis.ipynb
│       └── Dockerfile
├── secrets/                 # API credentials (gitignored)
├── docker-compose.yml
└── README.md
```

## Resource Efficiency

| Service | Memory | Purpose |
|---------|--------|---------|
| TypeScript | ~60MB | API calls, streaming |
| Python | ~80MB | Data analysis, backtesting |

Total: ~140MB for full stack

## License

MIT
