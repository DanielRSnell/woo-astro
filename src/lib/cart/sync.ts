import { graphqlRequest } from '../graphql';
import { getStoredCart, setStoredCart } from './storage';
import type { Cart } from '../types/cart';

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    contents {
      nodes {
        key
        quantity
        total
        product {
          id
          name
          slug
          image {
            sourceUrl
            altText
          }
        }
        variation {
          name
          price
        }
      }
      itemCount
    }
    total
    subtotal
    discountTotal
    shippingTotal
    totalTax
  }
`;

export async function syncCartWithServer(): Promise<void> {
  try {
    const localCart = getStoredCart();
    
    // Sync each item with server
    for (const item of localCart.contents.nodes) {
      if (item.key.startsWith('local-')) {
        await graphqlRequest(`
          mutation AddToCart($productId: ID!, $quantity: Int!) {
            addToCart(input: { productId: $productId, quantity: $quantity }) {
              cart {
                ...CartFields
              }
            }
          }
          ${CART_FRAGMENT}
        `, {
          productId: item.product.id,
          quantity: item.quantity,
        });
      }
    }

    // Get final server state
    const { cart } = await graphqlRequest(`
      query GetCart {
        cart {
          ...CartFields
        }
      }
      ${CART_FRAGMENT}
    `);

    setStoredCart(cart);
  } catch (error) {
    console.error('Failed to sync cart with server:', error);
  }
}

export async function syncCartItem(item: any): Promise<void> {
  try {
    if (item.key.startsWith('local-')) {
      await graphqlRequest(`
        mutation AddToCart($productId: ID!, $quantity: Int!) {
          addToCart(input: { productId: $productId, quantity: $quantity }) {
            cart {
              ...CartFields
            }
          }
        }
        ${CART_FRAGMENT}
      `, {
        productId: item.product.id,
        quantity: item.quantity,
      });
    }
  } catch (error) {
    console.error('Failed to sync cart item with server:', error);
  }
}
