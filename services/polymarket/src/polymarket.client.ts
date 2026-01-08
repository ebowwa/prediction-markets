/**
 * Polymarket API Client
 * Covers Gamma API (market discovery) and CLOB API (trading data)
 */

const GAMMA_API_BASE = 'https://gamma-api.polymarket.com';
const CLOB_API_BASE = 'https://clob.polymarket.com';
const DATA_API_BASE = 'https://data-api.polymarket.com';

// ============================================================================
// GAMMA API (Market Discovery)
// ============================================================================

export interface Market {
  condition_id: string;
  markets: Array<{
    market_id: string;
    question: string;
    description: string;
    end_date: string;
    active: boolean;
    closed: boolean;
    volume: number;
    liquidity: number;
    token_id: string;
    outcome_prices: number[]; // [YES price, NO price]
  }>;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  image: string;
  markets: string[];
  tags: string[];
}

export interface Profile {
  wallet_address: string;
  username?: string;
  profit_loss?: number;
  volume?: number;
  trades?: number;
  markets_traded?: number;
  biggest_win?: number;
}

/**
 * Fetch all markets with optional filtering
 */
export async function listMarkets(params: {
  limit?: number;
  offset?: number;
  archived?: boolean;
  closed?: boolean;
  active?: boolean;
  order?: 'volume' | 'liquidity' | 'createdAt';
  order_dir?: 'asc' | 'desc';
} = {}): Promise<{ markets: Market[] }> {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());
  if (params.archived !== undefined) searchParams.set('archived', params.archived.toString());
  if (params.closed !== undefined) searchParams.set('closed', params.closed.toString());
  if (params.active !== undefined) searchParams.set('active', params.active.toString());
  if (params.order) searchParams.set('order', params.order);
  if (params.order_dir) searchParams.set('order_dir', params.order_dir);

  const response = await fetch(`${GAMMA_API_BASE}/markets?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { markets: data.markets || [] };
}

/**
 * Fetch a specific market by condition ID
 */
export async function getMarket(conditionId: string): Promise<{ market: Market }> {
  const response = await fetch(`${GAMMA_API_BASE}/markets/${conditionId}`);
  if (!response.ok) {
    throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { market: data };
}

/**
 * Fetch all events
 */
export async function listEvents(params: {
  limit?: number;
  offset?: number;
  archived?: boolean;
  closed?: boolean;
  tag_id?: string;
} = {}): Promise<{ events: Event[] }> {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());
  if (params.archived !== undefined) searchParams.set('archived', params.archived.toString());
  if (params.closed !== undefined) searchParams.set('closed', params.closed.toString());
  if (params.tag_id) searchParams.set('tag_id', params.tag_id);

  const response = await fetch(`${GAMMA_API_BASE}/events?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { events: data.events || [] };
}

/**
 * Fetch a specific event
 */
export async function getEvent(eventSlug: string): Promise<{ event: Event }> {
  const response = await fetch(`${GAMMA_API_BASE}/events/${eventSlug}`);
  if (!response.ok) {
    throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { event: data };
}

/**
 * Fetch public profile data for a wallet address
 * This is how Polymarket shows P/L, volume, and positions publicly!
 */
export async function getProfile(walletAddress: string): Promise<{ profile: Profile }> {
  const response = await fetch(`${GAMMA_API_BASE}/profiles/${walletAddress}`);
  if (!response.ok) {
    throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { profile: data };
}

/**
 * Search across markets, events, and profiles
 */
export async function search(query: string, params: {
  limit?: number;
  offset?: number;
} = {}): Promise<any> {
  const searchParams = new URLSearchParams();
  searchParams.set('query', query);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const response = await fetch(`${GAMMA_API_BASE}/search?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// CLOB API (Order Book & Trading)
// ============================================================================

export interface OrderBook {
  market_id: string;
  bids: Array<{ price: number; size: number }>;
  asks: Array<{ price: number; size: number }>;
  last_updated: number;
}

/**
 * Fetch order book for a market
 */
export async function getMarketOrderbook(tokenId: string): Promise<{ orderbook: OrderBook }> {
  const response = await fetch(`${CLOB_API_BASE}/orderbook?token_id=${tokenId}`);
  if (!response.ok) {
    throw new Error(`CLOB API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { orderbook: data };
}

/**
 * Fetch recent trades for a market
 */
export async function getMarketTrades(tokenId: string, limit: number = 100): Promise<any> {
  const response = await fetch(`${CLOB_API_BASE}/history?token_id=${tokenId}&limit=${limit}`);
  if (!response.ok) {
    throw new Error(`CLOB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch current price for a token
 */
export async function getTokenPrice(tokenId: string): Promise<{ price: number }> {
  const response = await fetch(`${CLOB_API_BASE}/price?token_id=${tokenId}`);
  if (!response.ok) {
    throw new Error(`CLOB API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { price: data.price };
}

// ============================================================================
// DATA API (User Data - Public!)
// ============================================================================

/**
 * Fetch public positions for a wallet address
 * This is what Polymarket exposes that Kalshi keeps private!
 */
export async function getWalletPositions(walletAddress: string): Promise<any> {
  const response = await fetch(`${DATA_API_BASE}/positions?wallet=${walletAddress}`);
  if (!response.ok) {
    throw new Error(`Data API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch trade history for a wallet address (public!)
 */
export async function getWalletTrades(walletAddress: string, params: {
  limit?: number;
  offset?: number;
} = {}): Promise<any> {
  const searchParams = new URLSearchParams();
  searchParams.set('wallet', walletAddress);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const response = await fetch(`${DATA_API_BASE}/trades?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Data API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
