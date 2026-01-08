"""
Polymarket Demo Script
Shows how to use the Polymarket client
"""

import os
from client import PolymarketClient

# For local development, use localhost
POLYMARKET_TS_URL = os.getenv("POLYMARKET_TS_URL", "http://localhost:3001")


def main():
    print("=" * 60)
    print("Polymarket API Demo")
    print("=" * 60)

    with PolymarketClient() as client:
        # Health check
        print("\n1. Health Check")
        print("-" * 40)
        health = client.health()
        print(f"Service: {health['service']}")
        print(f"Status: {health['status']}")

        # List active markets
        print("\n2. Active Markets (by volume)")
        print("-" * 40)
        markets = client.list_markets(limit=5, active=True, order="volume")
        if markets.get("success"):
            for market in markets["data"]["markets"][:3]:
                print(f"\n  Question: {market['markets'][0]['question']}")
                print(f"  Volume: ${market['markets'][0].get('volume', 0):,.0f}")
                print(f"  Active: {market['markets'][0].get('active', False)}")

        # List events
        print("\n3. Recent Events")
        print("-" * 40)
        events = client.list_events(limit=5)
        if events.get("success"):
            for event in events["data"]["events"][:3]:
                print(f"\n  {event['title']}")
                print(f"  Slug: {event['slug']}")

        # Search
        print("\n4. Search for 'bitcoin'")
        print("-" * 40)
        search = client.search("bitcoin", limit=5)
        if search.get("success"):
            print(f"  Found {len(search['data'].get('results', []))} results")

        # Example: Get a public profile (from the @Rundeep example)
        print("\n5. Public Profile Example")
        print("-" * 40)
        wallet_address = "0x0afc7ce56285bde1fbe3a75efaffdfc86d6530b2"
        print(f"  Wallet: {wallet_address}")
        profile = client.get_profile(wallet_address)
        if profile.get("success"):
            print(f"  Profile data: {profile['data']}")


if __name__ == "__main__":
    main()
