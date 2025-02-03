import { graphqlRequest } from '../graphql';
import { getStoredCart, setStoredCart, updateStoredCart } from './storage';
import type { Cart } from '../types/cart';

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    contents {
      nodes {
        key
        quantity
        total
        product {
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

const GET_CART = `
  query GetCart {
    cart {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

const ADD_TO_CART = `
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

const UPDATE_CART_ITEM = `
  mutation UpdateCartItem($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: { items: [{ key: $key, quantity: $quantity }] }) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

const REMOVE_CART_ITEM = `
  mutation RemoveCartItem($key: ID!) {
    removeItemsFromCart(input: { keys: [$key] }) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export async function fetchCart(): Promise<Cart> {
  try {
    const data = await graphqlRequest(GET_CART);
    setStoredCart(data.cart);
    return data.cart;
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return getStoredCart();
  }
}

export async function addToCart(productId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> {
  try {
    updateStoredCart((cart) => ({
      ...cart,
      contents: {
        nodes: [
          ...cart.contents.nodes,
          {
            key: `temp-${Date.now()}`,
            quantity,
            total: '...',
            product: {
              id: productId,
              name: 'Loading...',
              slug: '',
            },
          },
        ],
        itemCount: cart.contents.itemCount + quantity,
      },
    }));

    window.dispatchEvent(new Event('cart:storage'));

    const data = await graphqlRequest(ADD_TO_CART, { productId, quantity });
    setStoredCart(data.addToCart.cart);

    return { success: true };
  } catch (error) {
    console.error('Failed to add to cart:', error);
    
    const currentCart = await fetchCart();
    setStoredCart(currentCart);

    window.dispatchEvent(new CustomEvent('toast:show', {
      detail: {
        title: 'Failed to add item',
        description: 'There was an error adding the item to your cart. Please try again.',
        type: 'error',
      },
    }));

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add item to cart' 
    };
  }
}

export async function updateCartItem(key: string, quantity: number): Promise<{ success: boolean; error?: string }> {
  try {
    updateStoredCart((cart) => ({
      ...cart,
      contents: {
        ...cart.contents,
        nodes: cart.contents.nodes.map((item) =>
          item.key === key ? { ...item, quantity } : item
        ),
      },
    }));

    window.dispatchEvent(new Event('cart:storage'));

    const data = await graphqlRequest(UPDATE_CART_ITEM, { key, quantity });
    setStoredCart(data.updateItemQuantities.cart);

    return { success: true };
  } catch (error) {
    console.error('Failed to update cart item:', error);
    
    const currentCart = await fetchCart();
    setStoredCart(currentCart);

    window.dispatchEvent(new CustomEvent('toast:show', {
      detail: {
        title: 'Failed to update item',
        description: 'There was an error updating the item quantity. Please try again.',
        type: 'error',
      },
    }));

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update item quantity' 
    };
  }
}

export async function removeCartItem(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    updateStoredCart((cart) => ({
      ...cart,
      contents: {
        ...cart.contents,
        nodes: cart.contents.nodes.filter((item) => item.key !== key),
        itemCount: cart.contents.itemCount - 1,
      },
    }));

    window.dispatchEvent(new Event('cart:storage'));

    const data = await graphqlRequest(REMOVE_CART_ITEM, { key });
    setStoredCart(data.removeItemsFromCart.cart);

    return { success: true };
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    
    const currentCart = await fetchCart();
    setStoredCart(currentCart);

    window.dispatchEvent(new CustomEvent('toast:show', {
      detail: {
        title: 'Failed to remove item',
        description: 'There was an error removing the item from your cart. Please try again.',
        type: 'error',
      },
    }));

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to remove item from cart' 
    };
  }
}
