import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  listMarkets,
  getMarket,
  listEvents,
  getEvent,
  getProfile,
  search,
  getMarketOrderbook,
  getMarketTrades,
  getTokenPrice,
  getWalletPositions,
  getWalletTrades,
} from './polymarket.client.js';

const app = new Hono();

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://localhost:8888', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.get('/', (c) => {
  return c.json({
    service: 'polymarket-service',
    version: '1.0.0',
    status: 'healthy',
    timestamp: Date.now(),
    endpoints: {
      markets: ['/api/markets', '/api/markets/:conditionId'],
      events: ['/api/events', '/api/events/:slug'],
      profiles: ['/api/profiles/:walletAddress'],
      search: ['/api/search'],
      orderbook: ['/api/orderbook/:tokenId'],
      trades: ['/api/trades/:tokenId'],
      price: ['/api/price/:tokenId'],
      positions: ['/api/positions/:walletAddress'],
      walletTrades: ['/api/wallet-trades/:walletAddress'],
    },
  });
});

// Markets
app.get('/api/markets', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const archived = c.req.query('archived') === 'true';
    const closed = c.req.query('closed') === 'true';
    const active = c.req.query('active') === 'true';
    const order = (c.req.query('order') || 'volume') as 'volume' | 'liquidity' | 'createdAt';
    const orderDir = (c.req.query('order_dir') || 'desc') as 'asc' | 'desc';

    const result = await listMarkets({ limit, offset, archived, closed, active, order, order_dir: orderDir });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/markets/:conditionId', async (c) => {
  try {
    const conditionId = c.req.param('conditionId');
    const result = await getMarket(conditionId);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Events
app.get('/api/events', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const archived = c.req.query('archived') === 'true';
    const closed = c.req.query('closed') === 'true';
    const tagId = c.req.query('tag_id') || undefined;

    const result = await listEvents({ limit, offset, archived, closed, tag_id: tagId });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/events/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const result = await getEvent(slug);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Profiles (Public!)
app.get('/api/profiles/:walletAddress', async (c) => {
  try {
    const walletAddress = c.req.param('walletAddress');
    const result = await getProfile(walletAddress);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Search
app.get('/api/search', async (c) => {
  try {
    const query = c.req.query('q') || '';
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');

    const result = await search(query, { limit, offset });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Order Book
app.get('/api/orderbook/:tokenId', async (c) => {
  try {
    const tokenId = c.req.param('tokenId');
    const result = await getMarketOrderbook(tokenId);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Trades
app.get('/api/trades/:tokenId', async (c) => {
  try {
    const tokenId = c.req.param('tokenId');
    const limit = parseInt(c.req.query('limit') || '100');
    const result = await getMarketTrades(tokenId, limit);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Price
app.get('/api/price/:tokenId', async (c) => {
  try {
    const tokenId = c.req.param('tokenId');
    const result = await getTokenPrice(tokenId);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Public Positions (by wallet - exposed on Polymarket!)
app.get('/api/positions/:walletAddress', async (c) => {
  try {
    const walletAddress = c.req.param('walletAddress');
    const result = await getWalletPositions(walletAddress);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Public Trade History (by wallet - exposed on Polymarket!)
app.get('/api/wallet-trades/:walletAddress', async (c) => {
  try {
    const walletAddress = c.req.param('walletAddress');
    const limit = parseInt(c.req.query('limit') || '100');
    const offset = parseInt(c.req.query('offset') || '0');
    const result = await getWalletTrades(walletAddress, { limit, offset });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export function getApp() {
  return app;
}
