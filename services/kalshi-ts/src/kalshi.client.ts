/**
 * Comprehensive Kalshi API Client
 * Covers all major API endpoints for trading, market data, and account management
 */

import {
  PortfolioApi,
  MarketApi,
  MarketsApi,
  ExchangeApi,
  OrdersApi,
  EventsApi,
  SeriesApi,
} from 'kalshi-typescript';
import { config } from './config.js';

// Initialize all Kalshi API clients
export const portfolioApi = new PortfolioApi(config);
export const marketApi = new MarketApi(config);
export const marketsApi = new MarketsApi(config);
export const exchangeApi = new ExchangeApi(config);
export const ordersApi = new OrdersApi(config);
export const eventsApi = new EventsApi(config);
export const seriesApi = new SeriesApi(config);

// ============================================================================
// PORTFOLIO API
// ============================================================================

export async function getBalance() {
  try {
    const response = await portfolioApi.getBalance();
    return {
      balance: (response.data.balance || 0) / 100,
      formatted: `$${(response.data.balance || 0) / 100}`,
      raw: response.data,
    };
  } catch (error: any) {
    console.error('Failed to fetch balance:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// MARKET API
// ============================================================================

export async function getMarket(ticker: string) {
  try {
    const response = await marketApi.getMarket(ticker);
    return { market: response.data.market };
  } catch (error: any) {
    console.error(`Failed to fetch market ${ticker}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function listMarkets(params: {
  limit?: number;
  cursor?: string;
  seriesTicker?: string;
  eventTicker?: string;
  status?: string;
  minCloseTs?: number;
  maxCloseTs?: number;
}) {
  try {
    const response = await marketsApi.getMarkets(
      params.limit || 50,
      params.cursor,
      params.eventTicker,
      params.seriesTicker,
      undefined, undefined,
      params.maxCloseTs,
      params.minCloseTs,
      undefined, undefined,
      params.status as any,
    );
    return {
      markets: response.data.markets || [],
      cursor: response.data.cursor,
    };
  } catch (error: any) {
    console.error('Failed to list markets:', error.response?.data || error.message);
    throw error;
  }
}

export async function getMarketOrderbook(ticker: string, depth?: number) {
  try {
    const response = await marketApi.getMarketOrderbook(ticker, depth);
    return { orderbook: response.data };
  } catch (error: any) {
    console.error(`Failed to fetch orderbook for ${ticker}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function getMarketTrades(params: {
  ticker: string;
  limit?: number;
  cursor?: string;
}) {
  try {
    const response = await marketApi.getTrades(
      params.ticker,
      params.limit || 100,
      params.cursor,
    );
    return {
      trades: response.data.trades || [],
      cursor: response.data.cursor,
    };
  } catch (error: any) {
    console.error(`Failed to fetch trades for ${params.ticker}:`, error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// ORDERS API
// ============================================================================

export async function createOrder(params: {
  ticker: string;
  side: 'yes' | 'no';
  action: 'buy' | 'sell';
  count: number;
  type: 'limit' | 'market';
  limit_price?: number;
  stop_price?: number;
  client_order_id?: string;
  expiration_ts?: number;
}) {
  try {
    const response = await ordersApi.createOrder(params as any);
    return {
      success: true,
      order: response.data.order,
    };
  } catch (error: any) {
    console.error('Failed to create order:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const response = await ordersApi.cancelOrder(orderId);
    return {
      success: true,
      order: response.data.order,
    };
  } catch (error: any) {
    console.error('Failed to cancel order:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

export async function listOrders(params: {
  limit?: number;
  cursor?: string;
  marketTicker?: string;
  eventTicker?: string;
  seriesTicker?: string;
  status?: string;
}) {
  try {
    const response = await ordersApi.getOrders(
      params.limit || 100,
      params.cursor,
      params.marketTicker,
      params.eventTicker,
      params.seriesTicker,
      undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      params.status,
    );
    return {
      orders: response.data.orders || [],
      cursor: response.data.cursor,
    };
  } catch (error: any) {
    console.error('Failed to list orders:', error.response?.data || error.message);
    throw error;
  }
}

export async function getOrder(orderId: string) {
  try {
    const response = await ordersApi.getOrder(orderId);
    return { order: response.data.order };
  } catch (error: any) {
    console.error(`Failed to fetch order ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function amendOrder(params: {
  orderId: string;
  count?: number;
  limit_price?: number;
}) {
  try {
    const response = await ordersApi.amendOrder(params.orderId, {
      count: params.count,
      limit_price: params.limit_price,
    } as any);
    return {
      success: true,
      order: response.data.order,
    };
  } catch (error: any) {
    console.error('Failed to amend order:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

// ============================================================================
// EVENTS API
// ============================================================================

export async function getEvent(eventTicker: string) {
  try {
    const response = await eventsApi.getEvent(eventTicker);
    return { event: response.data.event };
  } catch (error: any) {
    console.error(`Failed to fetch event ${eventTicker}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function listEvents(params: {
  limit?: number;
  cursor?: string;
  category?: string;
  status?: string;
}) {
  try {
    const response = await eventsApi.getEvents(
      params.limit || 50,
      params.cursor,
      undefined,
      params.category,
      undefined,
      undefined, undefined, undefined, undefined, undefined, undefined,
      params.status,
      undefined,
      undefined,
    );
    return {
      events: response.data.events || [],
      cursor: response.data.cursor,
    };
  } catch (error: any) {
    console.error('Failed to list events:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// SERIES API
// ============================================================================

export async function getSeries(seriesTicker: string) {
  try {
    const response = await seriesApi.getSeries(seriesTicker);
    return { series: response.data.series };
  } catch (error: any) {
    console.error(`Failed to fetch series ${seriesTicker}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function listSeries(params: {
  limit?: number;
  cursor?: string;
  category?: string;
}) {
  try {
    const response = await seriesApi.getSeriesList(
      params.limit || 50,
      params.cursor,
      undefined,
      params.category,
      undefined,
      undefined, undefined,
      undefined,
      undefined,
    );
    return {
      series: response.data.series || [],
      cursor: response.data.cursor,
    };
  } catch (error: any) {
    console.error('Failed to list series:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================================================
// EXCHANGE API
// ============================================================================

export async function getExchangeStatus() {
  try {
    const response = await exchangeApi.getExchangeStatus();
    return {
      exchangeActive: response.data.exchange_active,
      tradingActive: response.data.trading_active,
      raw: response.data,
    };
  } catch (error: any) {
    console.error('Failed to fetch exchange status:', error.response?.data || error.message);
    throw error;
  }
}
