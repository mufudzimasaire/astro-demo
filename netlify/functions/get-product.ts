import type { Handler } from '@netlify/functions'
const axios = require('axios');

type MetaAttribute = {
  [key: string]: string
}

interface ShiftProduct {
  id: string,
  type: string,
  attributes:  {
    canonical_path: string
    public_primary_asset_file_url: string
    reference: string
    title: string
    max_current_price: number
    meta_attributes: MetaAttribute
  },
  relationships: any
}

export interface Product {
  id: string
  canonical_path: string
  public_primary_asset_file_url: string
  reference: string
  title: string
  max_current_price: number
  meta_attributes: MetaAttribute
}

/**
 * Flattens API product attributes
 */
function transformProduct(product: Partial<ShiftProduct>): Product[] {
  return {
    id: product?.id || '',
    canonical_path: product?.attributes?.canonical_path || '',
    public_primary_asset_file_url: product?.attributes?.public_primary_asset_file_url || '',
    reference: product?.attributes?.reference || '',
    title: product?.attributes?.title || '',
    max_current_price: product?.attributes?.max_current_price || 0,
    meta_attributes: product?.attributes?.meta_attributes || {},
  }
}

/**
 * Product API Endpoint
 *
 * Purpose: Fetches a Product from Platform API
 *
 * Example:
 * ```
 * fetch('/.netlify/functions/get-product?id=1')
 * ```
 */
export const handler: Handler = async (event) => {
  try {
    const {
      API_TENANT,
      API_HOST,
      API_ACCESS_TOKEN
    } = process.env

    /** Platform API call for products */
    const response = await axios.get(`${API_HOST}/${API_TENANT}/v1/products/${event?.queryStringParameters?.id}`, {
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
      body: JSON.stringify({ data: transformProduct(response?.data?.data) })
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};

