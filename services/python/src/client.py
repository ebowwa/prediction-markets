"""
Kalshi Python Client - Calls the TypeScript service for data
Focuses on analysis, not API efficiency
"""

import os
from dataclasses import dataclass
from typing import Any

import httpx


@dataclass
class KalshiClient:
    """Python client for the Kalshi TypeScript service"""

    base_url: str = "http://kalshi-ts:3000"

    def __post_init__(self):
        self.base_url = os.getenv("KALSHI_TS_URL", self.base_url)
        self.client = httpx.Client(timeout=30.0)

    def _request(self, method: str, path: str, **kwargs) -> dict[str, Any]:
        """Make a request to the TS service"""
        response = self.client.request(method, f"{self.base_url}{path}", **kwargs)
        response.raise_for_status()
        return response.json()

    def health(self) -> dict[str, Any]:
        """Check if the TS service is healthy"""
        return self._request("GET", "/")

    def get_balance(self) -> dict[str, Any]:
        """Get account balance"""
        return self._request("GET", "/api/balance")

    def get_market(self, market_id: str) -> dict[str, Any]:
        """Get a specific market by ID"""
        return self._request("GET", f"/api/markets/{market_id}")

    def list_markets(
        self,
        limit: int = 50,
        status: str | None = None,
        series_ticker: str | None = None,
    ) -> dict[str, Any]:
        """List markets with optional filters"""
        params = {"limit": limit}
        if status:
            params["status"] = status
        if series_ticker:
            params["series_ticker"] = series_ticker
        return self._request("GET", "/api/markets", params=params)

    def get_exchange_status(self) -> dict[str, Any]:
        """Get exchange status"""
        return self._request("GET", "/api/exchange/status")

    def close(self):
        """Close the HTTP client"""
        self.client.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()
