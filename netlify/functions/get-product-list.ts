const axios = require('axios');

/**
 * Products API Endpoint
 *
 * Purpose: Fetch first 25 products from the Platform API
 *
 * Example:
 * ```
 * fetch('/.netlify/functions/get-product-list')
 * ```
 */
export const handler = async () => {
  try {
    const {
      API_TENANT,
      API_HOST,
      API_ACCESS_TOKEN
    } = process.env

    /** Platform API call for products */
    const response = await axios.get(`${API_HOST}/${API_TENANT}/v2/products?include=variants&fields[variants]=reference,sku&fields[products]=title,reference`, {
      auth: {
        username: API_TENANT,
        password: API_ACCESS_TOKEN,
      },
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'User-Agent': 'SHIFT Commerce mm astro demo',
      },
    })

    return { 
      statusCode: 200,
      body: response?.data?.data ? JSON.stringify({ data: response?.data?.data }) : []
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};

