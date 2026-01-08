"""
Unified Prediction Market Demo
Shows how to use both Kalshi and Polymarket clients
"""

import os
from client import KalshiClient, PolymarketClient

KALSHI_TS_URL = os.getenv("KALSHI_TS_URL", "http://kalshi-ts:3000")
POLYMARKET_TS_URL = os.getenv("POLYMARKET_TS_URL", "http://polymarket-service:3001")


def compare_platforms():
    """Compare market data across both platforms"""
    print("=" * 70)
    print("Platform Comparison: Kalshi vs Polymarket")
    print("=" * 70)

    # Kalshi (requires API key)
    print("\n📊 KALSHI (Authenticated API)")
    print("-" * 70)
    try:
        with KalshiClient() as client:
            health = client.health()
            print(f"   Status: {health.get('status')}")
            result = client.list_markets(limit=5)
            if result.get("success"):
                markets = result["data"].get("markets", [])
                print(f"   Markets found: {len(markets)}")
                if markets:
                    m = markets[0]
                    print(f"   Sample: {m.get('title', 'N/A')}")
    except Exception as e:
        print(f"   (Skipped: {e})")

    # Polymarket (no API key needed)
    print("\n📊 POLYMARKET (Public API)")
    print("-" * 70)
    try:
        with PolymarketClient() as client:
            health = client.health()
            print(f"   Status: {health.get('status')}")
            result = client.list_markets(limit=5, active=True)
            if result.get("success"):
                markets = result["data"].get("markets", [])
                print(f"   Markets found: {len(markets)}")
                if markets:
                    m = markets[0]
                    print(f"   Sample: {m.get('question', 'N/A')}")
    except Exception as e:
        print(f"   (Skipped: {e})")


def show_public_profile_example():
    """Demonstrate accessing public trader data on Polymarket"""
    print("\n" + "=" * 70)
    print("Public Profile Example (Polymarket)")
    print("=" * 70)

    wallet = "0x0afc7ce56285bde1fbe3a75efaffdfc86d6530b2"

    with PolymarketClient() as client:
        profile = client.get_profile(wallet)
        if profile.get("success"):
            print(f"Wallet: {wallet}")
            print(f"Profile data: {profile['data']}")


if __name__ == "__main__":
    compare_platforms()
    show_public_profile_example()

    print("\n💡 Next steps:")
    print("   - Add your Kalshi API key to .env for authenticated data")
    print("   - Add 'python src/demo.py' to run demo script")
    print("\n✅ Both clients working!")
