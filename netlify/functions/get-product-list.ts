const axios = require('axios');

interface ShiftProduct {
  id: string,
  type: string,
  attributes:  {
    canonical_path: string
    public_primary_asset_file_url: string
    reference: string
    title: string
  },
  relationships: any
}

export interface Product {
  id: string
  canonical_path: string
  public_primary_asset_file_url: string
  reference: string
  title: string
}

/**
 * Flattens API product attributes
 */
function transformProducts(products: ShiftProduct[]): Product[] {
  return (products  || []).reduce((accumulator: Product[], product: Partial<ShiftProduct>) => {
      accumulator.push({
        id: product?.id || '',
        canonical_path: product?.attributes?.canonical_path || '',
        public_primary_asset_file_url: product?.attributes?.public_primary_asset_file_url || '',
        reference: product?.attributes?.reference || '',
        title: product?.attributes?.title || '',
      })
    return accumulator
  }, [])
}

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
    const response = await axios.get(`${API_HOST}/${API_TENANT}/v2/products?fields[products]=title,reference,canonical_path,public_primary_asset_file_url`, {
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
      body: JSON.stringify({ data: transformProducts(response?.data?.data) })
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};

