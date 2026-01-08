"""
Analysis utilities for Kalshi market data
"""

import pandas as pd


def markets_to_dataframe(markets: list[dict]) -> pd.DataFrame:
    """Convert a list of markets to a pandas DataFrame"""

    flattened = []
    for market in markets:
        flattened.append({
            "id": market.get("market_id"),
            "title": market.get("title"),
            "status": market.get("status"),
            "close_time": market.get("close_time"),
            "yes_bid": market.get("yes_bid"),
            "yes_ask": market.get("yes_ask"),
            "no_bid": market.get("no_bid"),
            "no_ask": market.get("no_ask"),
            "volume": market.get("volume"),
            "liquidity": market.get("liquidity"),
        })

    df = pd.DataFrame(flattened)

    # Convert timestamp if present (ISO format from Kalshi)
    if "close_time" in df.columns:
        df["close_time"] = pd.to_datetime(df["close_time"])

    return df


def find_opportunities(df: pd.DataFrame, min_spread: float = 0.02) -> pd.DataFrame:
    """Find markets with wide bid-ask spreads (potential opportunities)"""

    if "yes_bid" in df.columns and "yes_ask" in df.columns:
        df = df.copy()
        df["spread"] = df["yes_ask"] - df["yes_bid"]
        df["implied_prob"] = (df["yes_bid"] + df["yes_ask"]) / 2
        return df[df["spread"] >= min_spread].sort_values("spread", ascending=False)

    return df


def summary_stats(df: pd.DataFrame) -> dict:
    """Generate summary statistics for markets"""

    stats = {
        "total_markets": len(df),
        "by_status": df["status"].value_counts().to_dict() if "status" in df.columns else {},
    }

    if "volume" in df.columns and df["volume"].notna().any():
        stats["avg_volume"] = df["volume"].mean()
        stats["total_volume"] = df["volume"].sum()

    if "yes_bid" in df.columns:
        stats["avg_yes_price"] = df["yes_bid"].mean()

    return stats
