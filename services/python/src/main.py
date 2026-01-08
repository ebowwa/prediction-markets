"""
Main entry point for Python client
Demonstrates calling the TS service and analyzing data
"""

import time
from client import KalshiClient
from analysis import markets_to_dataframe, find_opportunities, summary_stats


def main():
    print("""
╔════════════════════════════════════════════════════════════╗
║           Kalshi Python Client                             ║
║                                                              ║
║  ✓ Calls TypeScript service for data                        ║
║  ✓ pandas for analysis and visualization                    ║
║  ✓ Ready for backtesting and strategy work                  ║
╚════════════════════════════════════════════════════════════╝
""")

    with KalshiClient() as client:
        # Check health
        print("🔍 Checking TS service health...")
        health = client.health()
        print(f"   Status: {health.get('status')}\n")

        # Get exchange status
        print("📊 Fetching exchange status...")
        try:
            status = client.get_exchange_status()
            if status.get("success"):
                print(f"   Exchange is: {status['data'].get('trading_status', 'unknown')}\n")
        except Exception as e:
            print(f"   (Skipped: {e})\n")

        # List markets
        print("📈 Fetching recent markets...")
        result = client.list_markets(limit=20, status="open")

        if not result.get("success"):
            print(f"   ❌ Error: {result.get('error')}")
            print("\n💡 Tip: Make sure KALSHI_API_KEY_ID is set in .env")
            return

        markets = result["data"].get("markets", [])
        print(f"   Found {len(markets)} markets\n")

        if markets:
            # Convert to DataFrame for analysis
            df = markets_to_dataframe(markets)

            print("📊 Sample markets:")
            print(
                df[["title", "yes_bid", "yes_ask", "volume"]]
                .head(5)
                .to_string(index=False)
            )

            # Find opportunities
            opportunities = find_opportunities(df, min_spread=0.01)
            if len(opportunities) > 0:
                print(f"\n💰 Markets with spreads >= 1%:")
                print(
                    opportunities[["title", "yes_bid", "yes_ask", "spread"]]
                    .head(5)
                    .to_string(index=False)
                )

            # Summary stats
            stats = summary_stats(df)
            print(f"\n📈 Summary: {stats['total_markets']} markets, "
                  f"${stats.get('total_volume', 0):.0f} total volume")

        print("\n✅ Analysis complete!")
        print("\n💡 Next steps:")
        print("   - Add your API key to .env for authenticated requests")
        print("   - Try the Jupyter notebook: docker-compose run kalshi-python jupyter notebook")
        print("   - Extend analysis.py with your strategy logic")


if __name__ == "__main__":
    main()
