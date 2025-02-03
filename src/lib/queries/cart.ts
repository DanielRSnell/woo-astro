import { createQuery } from '../graphql-client';

export const getCartQuery = createQuery(`
  query getCart {
    cart {
      contents {
        nodes {
          key
          quantity
          total
          product {
            node {
              id
              name
              slug
              image {
                sourceUrl
                altText
              }
            }
          }
          variation {
            node {
              id
              name
              price
            }
          }
        }
        itemCount
        productCount
      }
      total
      subtotal
      discountTotal
      shippingTotal
      totalTax
    }
  }
`);
