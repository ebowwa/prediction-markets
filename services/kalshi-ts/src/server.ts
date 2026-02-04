import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  getBalance,
  createOrder,
  cancelOrder,
  getOrder,
  listOrders,
  amendOrder,
  getMarket,
  listMarkets,
  getMarketOrderbook,
  getMarketTrades,
  getEvent,
  listEvents,
  getSeries,
  listSeries,
  getExchangeStatus,
} from './kalshi.client.js';

const app = new Hono();

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://localhost:8888', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.get('/', (c) => {
  return c.json({
    service: 'kalshi-ts-service',
    version: '2.0.0',
    status: 'healthy',
    timestamp: Date.now(),
    endpoints: {
      portfolio: ['/api/balance'],
      orders: ['/api/orders', '/api/orders/:id', '/api/orders/create', '/api/orders/cancel', '/api/orders/amend'],
      markets: ['/api/markets', '/api/markets/:ticker', '/api/markets/:ticker/orderbook', '/api/markets/:ticker/trades'],
      events: ['/api/events', '/api/events/:ticker'],
      series: ['/api/series', '/api/series/:ticker'],
      exchange: ['/api/exchange/status'],
    },
  });
});

// Portfolio
app.get('/api/balance', async (c) => {
  try {
    const result = await getBalance();
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Orders
app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json();
    const result = await createOrder(body);
    return c.json(result);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/orders', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '100');
    const cursor = c.req.query('cursor') || undefined;
    const marketTicker = c.req.query('market_ticker') || undefined;
    const eventTicker = c.req.query('event_ticker') || undefined;
    const seriesTicker = c.req.query('series_ticker') || undefined;
    const status = c.req.query('status') || undefined;

    const result = await listOrders({ limit, cursor, marketTicker, eventTicker, seriesTicker, status });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/orders/:id', async (c) => {
  try {
    const orderId = c.req.param('id');
    const result = await getOrder(orderId);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete('/api/orders/:id', async (c) => {
  try {
    const orderId = c.req.param('id');
    const result = await cancelOrder(orderId);
    return c.json(result);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put('/api/orders/:id', async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json();
    const result = await amendOrder({ orderId, ...body });
    return c.json(result);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Markets
app.get('/api/markets', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const cursor = c.req.query('cursor') || undefined;
    const seriesTicker = c.req.query('series_ticker') || undefined;
    const eventTicker = c.req.query('event_ticker') || undefined;
    const status = c.req.query('status') || undefined;

    const result = await listMarkets({ limit, cursor, seriesTicker, eventTicker, status });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/markets/:ticker', async (c) => {
  try {
    const ticker = c.req.param('ticker');
    const result = await getMarket(ticker);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/markets/:ticker/orderbook', async (c) => {
  try {
    const ticker = c.req.param('ticker');
    const depthStr = c.req.query('depth');
    const depth = depthStr ? parseInt(depthStr, 10) : undefined;
    const result = await getMarketOrderbook(ticker, depth);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/markets/:ticker/trades', async (c) => {
  try {
    const ticker = c.req.param('ticker');
    const limit = parseInt(c.req.query('limit') || '100');
    const cursor = c.req.query('cursor') || undefined;
    const result = await getMarketTrades({ ticker, limit, cursor });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Events
app.get('/api/events', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const cursor = c.req.query('cursor') || undefined;
    const category = c.req.query('category') || undefined;
    const status = c.req.query('status') || undefined;

    const result = await listEvents({ limit, cursor, category, status });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/events/:ticker', async (c) => {
  try {
    const eventTicker = c.req.param('ticker');
    const result = await getEvent(eventTicker);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Series
app.get('/api/series', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const cursor = c.req.query('cursor') || undefined;
    const category = c.req.query('category') || undefined;

    const result = await listSeries({ limit, cursor, category });
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/series/:ticker', async (c) => {
  try {
    const seriesTicker = c.req.param('ticker');
    const result = await getSeries(seriesTicker);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Exchange
app.get('/api/exchange/status', async (c) => {
  try {
    const result = await getExchangeStatus();
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export function getApp() {
  return app;
}
