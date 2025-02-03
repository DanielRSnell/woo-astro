import { createQuery } from '../../graphql-client';

export const getProductsByCategory = createQuery(`
  query getProducts($after: String, $slug: [String], $first: Int = 9999, $orderby: ProductsOrderByEnum = DATE) {
    products(
      first: $first
      after: $after
      where: { 
        categoryIn: $slug, 
        visibility: VISIBLE, 
        minPrice: 0, 
        orderby: { field: $orderby, order: DESC }, 
        status: "publish" 
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        __typename
        name
        slug
        type
        databaseId
        id
        averageRating
        reviewCount
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          image {
            sourceUrl
            altText
            title
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
          image {
            sourceUrl
            altText
            title
          }
        }
        ... on ExternalProduct {
          price
          externalUrl
          image {
            sourceUrl
            altText
            title
          }
        }
      }
    }
  }
`);

export async function fetchProductsByCategory(
  slug: string[], 
  first = 9999, 
  after: string | null = null, 
  orderby: 'DATE' | 'PRICE' | 'RATING' = 'DATE'
) {
  try {
    console.log('Fetching products for category:', slug);
    const data = await getProductsByCategory.exec({ 
      slug, 
      first, 
      after, 
      orderby 
    });
    
    console.log('Products fetched:', data.products?.nodes?.length || 0);
    console.log('Has next page:', data.products?.pageInfo?.hasNextPage || false);
    
    // Normalize products to ensure consistent structure
    const normalizedProducts = (data.products?.nodes || []).map(product => ({
      ...product,
      price: product.price || product.regularPrice || '',
      image: product.image || { 
        sourceUrl: '', 
        altText: '', 
        title: '' 
      }
    }));

    return { 
      nodes: normalizedProducts, 
      pageInfo: data.products?.pageInfo || { 
        hasNextPage: false, 
        endCursor: null 
      } 
    };
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    return { 
      nodes: [], 
      pageInfo: { 
        hasNextPage: false, 
        endCursor: null 
      } 
    };
  }
}
