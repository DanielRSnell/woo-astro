import { createQuery } from '../../graphql-client';

export const getProductSlugsQuery = createQuery(`
  query getProductSlugs($first: Int = 100) {
    products(first: $first) {
      nodes {
        slug
      }
    }
  }
`);

export async function fetchAllProductSlugs(first = 100) {
  try {
    const data = await getProductSlugsQuery.exec({ first });
    
    console.log('Fetched product slugs:', data.products?.nodes?.length || 0);
    
    return (data.products?.nodes || [])
      .map(product => product.slug)
      .filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch product slugs:', error);
    return [];
  }
}
