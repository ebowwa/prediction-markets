import { Configuration } from 'kalshi-typescript';

export function createKalshiConfig(): Configuration {
  const apiKeyId = process.env.KALSHI_API_KEY_ID;
  const privateKeyPath = process.env.KALSHI_PRIVATE_KEY_PATH;
  const baseUrl = process.env.KALSHI_BASE_URL || 'https://api.elections.kalshi.com/trade-api/v2';

  if (!apiKeyId) {
    console.warn('⚠️  KALSHI_API_KEY_ID not set - using unauthenticated mode');
    return new Configuration({
      basePath: baseUrl,
    });
  }

  if (!privateKeyPath) {
    throw new Error('KALSHI_PRIVATE_KEY_PATH required when API key is provided');
  }

  return new Configuration({
    apiKey: apiKeyId,
    privateKeyPath,
    basePath: baseUrl,
  });
}

export const config = createKalshiConfig();
