import { createQuery } from '../../graphql-client';

export const getAllProductsQuery = createQuery(`
  query getProducts($first: Int = 9999) {
    products(
      first: $first,
      where: {
        visibility: VISIBLE, 
        minPrice: 0, 
        orderby: {field: DATE, order: DESC}, 
        status: "publish", 
        typeIn: [SIMPLE, VARIABLE]
      }
    ) {
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
          productCategories {
            nodes {
              name
            }
          }
          regularPrice
          salePrice
          stockStatus
          image {
            sourceUrl
            altText
            title
          }
          galleryImages {
            nodes {
              sourceUrl
              altText
              title
            }
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
          productCategories {
            nodes {
              name
            }
          }
          image {
            sourceUrl
            altText
            title
          }
          galleryImages {
            nodes {
              sourceUrl
              altText
              title
            }
          }
          variations {
            nodes {
              id
              price
              regularPrice
              salePrice
              stockStatus
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`);
