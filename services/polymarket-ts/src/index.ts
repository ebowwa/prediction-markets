import { getApp } from './server.js';

const port = parseInt(process.env.PORT || '3001');

Bun.serve({
  fetch: getApp().fetch,
  port,
});

console.log(`Polymarket service running on http://localhost:${port} (powered by Bun)`);
