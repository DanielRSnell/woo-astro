export const CART_FRAGMENT = `
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

export const GET_CART = `
  query GetCart {
    cart {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const ADD_TO_CART = `
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const UPDATE_CART_ITEM = `
  mutation UpdateCartItem($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: { items: [{ key: $key, quantity: $quantity }] }) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const REMOVE_CART_ITEM = `
  mutation RemoveCartItem($key: ID!) {
    removeItemsFromCart(input: { keys: [$key] }) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;
