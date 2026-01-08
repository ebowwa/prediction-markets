import { serve } from '@hono/node-server';
import { getApp } from './server.js';

const port = parseInt(process.env.PORT || '3001');

serve({
  fetch: getApp().fetch,
  port,
});

console.log(`Polymarket service running on http://localhost:${port}`);
