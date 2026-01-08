import { serve } from '@hono/node-server';
import { getApp } from './server.js';

// @ts-ignore - process is available at runtime
const port = parseInt(process.env.PORT || '3001');

serve({
  fetch: getApp().fetch,
  port,
});

// @ts-ignore - console is available at runtime
console.log(`Polymarket service running on http://localhost:${port}`);
