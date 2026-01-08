import { serve } from '@hono/node-server';
import { getApp } from './server.js';

const port = parseInt(process.env.PORT || '3000');

console.log(`
╔════════════════════════════════════════════════════════════╗
║           Kalshi TypeScript Service                        ║
║                                                              ║
║  ✓ Efficient feed handler for Kalshi API                   ║
║  ✓ Endpoints for balance, markets, exchange status         ║
║  ✓ Ready for Python client integration                     ║
╚════════════════════════════════════════════════════════════╝
`);

serve({
  fetch: getApp().fetch,
  port,
});

console.log(`🚀 Server running on http://localhost:${port}`);
