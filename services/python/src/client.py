"""
Unified Prediction Market Client
Supports both Kalshi and Polymarket APIs
"""

import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any
from enum import Enum

import httpx


class MarketType(Enum):
    KALSHI = "kalshi"
    POLYMARKET = "polymarket"


@dataclass
class PredictionMarketClient(ABC):
    """Base class for prediction market clients"""

    base_url: str
    market_type: MarketType

    def __post_init__(self):
        env_var = f"{self.market_type.value.upper()}_TS_URL"
        self.base_url = os.getenv(env_var, self.base_url)
        self.client = httpx.Client(timeout=30.0)

    def _request(self, method: str, path: str, **kwargs) -> dict[str, Any]:
        """Make a request to the API"""
        response = self.client.request(method, f"{self.base_url}{path}", **kwargs)
        response.raise_for_status()
        return response.json()

    def health(self) -> dict[str, Any]:
        """Check if the service is healthy"""
        return self._request("GET", "/")

    @abstractmethod
    def list_markets(self, limit: int = 50, **kwargs) -> dict[str, Any]:
        """List markets with optional filters"""
        pass

    def close(self):
        """Close the HTTP client"""
        self.client.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class KalshiClient(PredictionMarketClient):
    """Client for Kalshi prediction markets"""

    def __init__(self):
        super().__init__(base_url="http://kalshi-ts:3000", market_type=MarketType.KALSHI)

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


class PolymarketClient(PredictionMarketClient):
    """Client for Polymarket prediction markets"""

    def __init__(self):
        super().__init__(base_url="http://polymarket-service:3001", market_type=MarketType.POLYMARKET)

    def list_markets(
        self,
        limit: int = 50,
        offset: int = 0,
        active: bool = True,
        closed: bool = False,
        order: str = "volume",
        order_dir: str = "desc",
    ) -> dict[str, Any]:
        """List markets with optional filters"""
        params = {
            "limit": limit,
            "offset": offset,
            "active": str(active).lower(),
            "closed": str(closed).lower(),
            "order": order,
            "order_dir": order_dir,
        }
        return self._request("GET", "/api/markets", params=params)

    def get_market(self, condition_id: str) -> dict[str, Any]:
        """Get a specific market by condition ID"""
        return self._request("GET", f"/api/markets/{condition_id}")

    def list_events(
        self,
        limit: int = 50,
        offset: int = 0,
        closed: bool = False,
    ) -> dict[str, Any]:
        """List events"""
        params = {
            "limit": limit,
            "offset": offset,
            "closed": str(closed).lower(),
        }
        return self._request("GET", "/api/events", params=params)

    def get_event(self, slug: str) -> dict[str, Any]:
        """Get a specific event by slug"""
        return self._request("GET", f"/api/events/{slug}")

    def get_profile(self, wallet_address: str) -> dict[str, Any]:
        """Get public profile for a wallet address (P/L, volume, etc.)"""
        return self._request("GET", f"/api/profiles/{wallet_address}")

    def search(self, query: str, limit: int = 20) -> dict[str, Any]:
        """Search across markets, events, and profiles"""
        params = {"q": query, "limit": limit}
        return self._request("GET", "/api/search", params=params)

    def get_orderbook(self, token_id: str) -> dict[str, Any]:
        """Get order book for a market"""
        return self._request("GET", f"/api/orderbook/{token_id}")

    def get_trades(self, token_id: str, limit: int = 100) -> dict[str, Any]:
        """Get recent trades for a market"""
        params = {"limit": limit}
        return self._request("GET", f"/api/trades/{token_id}", params=params)

    def get_price(self, token_id: str) -> dict[str, Any]:
        """Get current price for a token"""
        return self._request("GET", f"/api/price/{token_id}")

    def get_positions(self, wallet_address: str) -> dict[str, Any]:
        """Get public positions for a wallet address"""
        return self._request("GET", f"/api/positions/{wallet_address}")

    def get_wallet_trades(
        self,
        wallet_address: str,
        limit: int = 100,
        offset: int = 0,
    ) -> dict[str, Any]:
        """Get public trade history for a wallet address"""
        params = {"limit": limit, "offset": offset}
        return self._request("GET", f"/api/wallet-trades/{wallet_address}", params=params)
