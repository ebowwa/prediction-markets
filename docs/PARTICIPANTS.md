# Market Participants & Data Visibility

## TL;DR

**You CANNOT see individual traders.** Kalshi is anonymous by design — like a dark pool, you see the trades, not the traders.

---

## What Data IS Available

### ✅ Market Depth (Order Book)

```
YES BIDS                  NO BIDS
Price    Qty        Price    Qty
65¢      1,000      35¢      500
64¢      2,500      36¢      1,200
63¢      5,000      37¢      2,000
```

**What this tells you:**
- Total interest at each price level
- Market liquidity and depth
- Where the next price movement might happen

### ✅ Trade History

```json
{
  "trades": [
    {"price": 65, "count": 100, "created_at": "2025-01-07T20:00:00Z"},
    {"price": 66, "count": 500, "created_at": "2025-01-07T20:01:00Z"}
  ]
}
```

**What this tells you:**
- When trades happened
- At what price and quantity
- **NOT** who traded (anonymous)

### ✅ Aggregate Metrics

| Metric | Description |
|--------|-------------|
| `volume` | Total contracts traded |
| `open_interest` | Total contracts held by all traders |
| `yes_bid` / `yes_ask` | Current best bid/ask prices |
| `last_price` | Most recent trade price |

---

## What Data is NOT Available

### ❌ Individual Identities

- No usernames
- No account IDs
- No real names
- No IP addresses

### ❌ Position Ownership

- You can't see "User A holds 500 Yes contracts"
- You can't see another trader's open orders
- You can't see who's on the other side of your trade

### ❌ Counterparty Information

When you place an order, you're matched anonymously:
- **Your trade:** Buy 100 Yes @ 65¢
- **Counterparty:** Someone else's Sell 100 Yes @ 65¢
- **What you see:** Trade executed ✅
- **What you DON'T see:** Who sold to you ❌

---

## Why Anonymous?

### 1. **Fair Markets**

If you could see "whale" traders, you'd:
- Front-run their orders
- Copy their positions
- Advantage them based on information, not analysis

### 2. **Privacy Protection**

Large traders would avoid markets if:
- Their position sizes were visible to competitors
- Their trading strategies could be reverse-engineered
- Their entry/exit signals would be front-run

### 3. **Regulatory Compliance**

Kalshi is a CFTC-regulated exchange. Anonymity:
- Protects retail traders
- Prevents market manipulation
- Encourages honest participation

---

## What You CAN Do Instead

### 📊 **Market Sentiment Analysis**

Track aggregate behavior over time:

```python
# Are people becoming more bullish?
implied_prob = (yes_bid + yes_ask) / 2

# Is there buying pressure?
bid_pressure = sum([qty for price, qty in orderbook if price > threshold])

# Is volume increasing?
volume_velocity = volume_now / volume_1h_ago
```

### 🔍 **Order Flow Analysis**

Detect sophisticated trading patterns:

```python
# Large trades (possible informed traders)
if trade_count > 1000:
    print("Unusual activity - possible smart money")

# Rapid price movement (possible news)
if price_change_1min > 0.05:
    print("Fast move - possible breaking news")
```

### 📈 **Implied Probability Tracking**

How does market perception evolve?

```python
# Over time
probability_history = [
    {"time": "09:00", "yes_price": 0.50},  # 50%
    {"time": "10:00", "yes_price": 0.65},  # 65%
    {"time": "11:00", "yes_price": 0.72},  # 72%
]

# Market became more bullish over time
```

---

## Comparison: Kalshi vs Other Markets

| Market | Shows Individual Traders? | Reason |
|--------|---------------------------|---------|
| **Kalshi** | ❌ No | Private accounts, hidden positions |
| **Polymarket** | ✅ Yes | Public profiles, visible P/L by wallet |
| **Stock Market** | ✅ Yes | Level 2 data (for a fee) |
| **Prediction Market** | Varies | Design philosophy dependent |

**Note:** This document focuses on Kalshi's anonymity model. Polymarket takes a different approach with public user profiles. See [PLATFORM-COMPARISON.md](PLATFORM-COMPARISON.md) for a detailed comparison. |

---

## Example: Interpreting What You CAN See

### Scenario: Large Sudden Trade

```json
{
  "ticker": "YES-TEAM-WINS",
  "trade": {
    "price": 85,
    "count": 5000,
    "timestamp": "2025-01-07T14:30:00Z"
  }
}
```

**What you know:**
- Someone bought 5,000 Yes contracts at 85¢
- This is a $4,250 position
- It happened at 2:30 PM

**What you DON'T know:**
- Was this one person or multiple?
- Is this an institutional trader?
- Do they have inside information?
- Are they hedging or speculating?

**What you CAN infer:**
- High confidence (85% implied probability)
- Significant capital at risk
- Possible information event

---

## Technical Implementation

### Checking Market Depth

```python
from client import KalshiClient

client = KalshiClient()

# Get orderbook for a market
orderbook = client.get_market_orderbook("MARKET-TICKER")

# Analyze depth
yes_bid_depth = sum(level['quantity'] for level in orderbook['yes_bids'])
no_bid_depth = sum(level['quantity'] for level in orderbook['no_bids'])

print(f"Yes side depth: {yes_bid_depth} contracts")
print(f"No side depth: {no_bid_depth} contracts")
```

### Tracking Trade Flow

```python
# Get recent trades
trades = client.get_market_trades(
    ticker="MARKET-TICKER",
    limit=100
)

# Analyze trade sizes
import pandas as pd

df = pd.DataFrame(trades['trades'])
df['datetime'] = pd.to_datetime(df['created_at'])

# Find unusual trades
unusual = df[df['count'] > df['count'].std() * 2]
print(f"Found {len(unusual)} unusually large trades")
```

---

## FAQ

**Q: Can I see who bought my contracts from me?**
A: No. Trades are anonymous. You know you sold, but not who bought.

**Q: Can I track a "whale trader's" activity?**
A: Only indirectly. You might see "someone bought 5,000 contracts at once" repeatedly, but you won't know it's the same person each time.

**Q: What if I want to copy successful traders?**
A: You can't identify them, but you CAN:
- Follow large trade patterns
- Track markets where volume suddenly increases
- Monitor order book depth changes

**Q: Is there ANY way to see participants?**
A: Only yourself. The API shows:
- Your positions
- Your order history
- Your fills
- NOT other users' data

---

## Summary

| You CAN See | You CANNOT See |
|--------------|-----------------|
| Order book depth | Individual trader identities |
| Trade history (price/qty/time) | Other users' positions |
| Volume & open interest | Who's on the other side of trades |
| Price movements | Real names or usernames |
| Market sentiment | Counterparty information |

**Kalshi provides transparency into MARKETS, not PEOPLE.** This is intentional, ethical, and consistent with prediction market design worldwide.
