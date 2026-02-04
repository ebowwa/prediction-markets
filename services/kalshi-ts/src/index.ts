import { getApp } from './server.js';

const port = parseInt(process.env.PORT || '3000');

console.log(`
╔════════════════════════════════════════════════════════════╗
║           Kalshi TypeScript Service                        ║
║           Powered by Bun                                    ║
║                                                              ║
║  ✓ Efficient feed handler for Kalshi API                   ║
║  ✓ Endpoints for balance, markets, exchange status         ║
║  ✓ Bun native server for max performance                   ║
╚════════════════════════════════════════════════════════════╝
`);

Bun.serve({
  fetch: getApp().fetch,
  port,
});

console.log(`🚀 Server running on http://localhost:${port}`);
