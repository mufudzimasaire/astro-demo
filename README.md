Test Astro app that uses Netlify functions to query the SHIFT Platform API for product data.

## Environment Variables Required

Add SHIFT Platform API `API_ACCESS_TOKEN`, `API_HOST` and `API_TENANT` env vars (in your `.env`) to get going...

## Serverless Functions

| Path | Edge Function |
|--- |---|
| `/` | /netlify/functions/get-product-list |
| `/products/[id]` | /netlify/functions/get-product |
