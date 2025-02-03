import { createQuery } from '../../graphql-client';

export const getProductCategories = createQuery(`
  query getProductCategories($first: Int = 20) {
    productCategories(
      first: $first, 
      where: { 
        orderby: COUNT, 
        order: DESC, 
        hideEmpty: true 
      }
    ) {
      nodes {
        count
        databaseId
        id
        name
        slug
        image {
          sourceUrl(size: MEDIUM_LARGE)
          altText
          title
        }
        description
        parent {
          node {
            name
            slug
          }
        }
      }
    }
  }
`);

export async function fetchCategories(first = 20) {
  try {
    const data = await getProductCategories.exec({ first });
    
    // Optional: Filter out subcategories if needed
    const topLevelCategories = data.productCategories?.nodes.filter(
      category => !category.parent?.node
    ) || [];

    console.log(`Fetched ${topLevelCategories.length} categories`);
    
    return topLevelCategories;
  } catch (error) {
    console.error('Failed to fetch product categories:', error);
    return [];
  }
}
