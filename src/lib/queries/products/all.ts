import { createQuery } from '../graphql-client';

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
        productCategories {
          nodes {
            name
            slug
            databaseId
            description
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          shortDescription
          description
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
          shortDescription
          description
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
              name
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
