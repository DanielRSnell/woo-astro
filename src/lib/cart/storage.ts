import type { Cart, CartItem, AddToCartInput, ProductAttribute } from '../types/cart';

const CART_STORAGE_KEY = 'cart:storage';

export const DEFAULT_CART: Cart = {
  contents: {
    nodes: [],
    itemCount: 0,
  },
  total: '0.00',
  subtotal: '0.00',
  discountTotal: '0.00',
  shippingTotal: '0.00',
  totalTax: '0.00',
};

function formatPrice(price: string | number): string {
  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[^0-9.]/g, '')) 
    : price;
  return `$${numericPrice.toFixed(2)}`;
}

function calculateCartTotals(items: CartItem[]): Cart {
  console.log('Calculating cart totals for items:', items);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat((item.variation?.price || item.product.price || '0').replace(/[^0-9.]/g, '')) || 0;
    return sum + (price * item.quantity);
  }, 0);

  const cart = {
    contents: {
      nodes: items,
      itemCount,
    },
    subtotal: formatPrice(subtotal),
    total: formatPrice(subtotal), // In a real app, you'd add tax and shipping here
    discountTotal: '$0.00',
    shippingTotal: '$0.00',
    totalTax: '$0.00',
  };

  console.log('Calculated cart totals:', cart);
  return cart;
}

function generateCartItemKey(product: CartProduct, attributes?: ProductAttribute[]): string {
  if (!attributes?.length) {
    return `local-${product.id}`;
  }
  
  const attributeString = attributes
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(attr => `${attr.name}:${attr.value}`)
    .join('-');
  
  const key = `local-${product.id}-${attributeString}`;
  console.log('Generated cart item key:', key);
  return key;
}

export function getStoredCart(): Cart {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const cart = stored ? JSON.parse(stored) : DEFAULT_CART;
    console.log('Retrieved cart from storage:', cart);
    return cart;
  } catch (error) {
    console.error('Failed to get cart from storage:', error);
    return DEFAULT_CART;
  }
}

export function setStoredCart(cart: Cart): void {
  try {
    console.log('Storing cart:', cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart:storage'));
  } catch (error) {
    console.error('Failed to store cart:', error);
  }
}

export function addItemToCart({ product, quantity = 1, variation, attributes }: AddToCartInput): Cart {
  console.log('Adding item to cart:', { product, quantity, variation, attributes });
  
  const cart = getStoredCart();
  const cartItemKey = generateCartItemKey(product, attributes);

  const existingItemIndex = cart.contents.nodes.findIndex(item => {
    const isSameProduct = item.product.id === product.id;
    const isSameVariation = variation 
      ? item.variation?.databaseId === variation.databaseId
      : !item.variation;
    const isSameAttributes = JSON.stringify(item.attributes) === JSON.stringify(attributes);
    
    return isSameProduct && isSameVariation && isSameAttributes;
  });

  let updatedItems;
  if (existingItemIndex >= 0) {
    console.log('Updating existing item quantity');
    updatedItems = cart.contents.nodes.map((item, index) =>
      index === existingItemIndex
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    console.log('Adding new item to cart');
    const newItem: CartItem = {
      key: cartItemKey,
      quantity,
      total: variation?.price || product.price || '$0.00',
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        type: product.type,
      },
      variation: variation ? {
        id: variation.id,
        databaseId: variation.databaseId,
        name: variation.name,
        price: variation.price,
        attributes: variation.attributes,
      } : undefined,
      attributes,
    };
    updatedItems = [...cart.contents.nodes, newItem];
  }

  const updatedCart = calculateCartTotals(updatedItems);
  setStoredCart(updatedCart);
  return updatedCart;
}

export function updateCartItemQuantity(key: string, quantity: number): Cart {
  console.log('Updating cart item quantity:', { key, quantity });
  
  const cart = getStoredCart();
  const updatedItems = cart.contents.nodes.map(item =>
    item.key === key ? { ...item, quantity } : item
  );
  
  const updatedCart = calculateCartTotals(updatedItems);
  setStoredCart(updatedCart);
  return updatedCart;
}

export function removeCartItem(key: string): Cart {
  console.log('Removing cart item:', key);
  
  const cart = getStoredCart();
  const updatedItems = cart.contents.nodes.filter(item => item.key !== key);
  
  const updatedCart = calculateCartTotals(updatedItems);
  setStoredCart(updatedCart);
  return updatedCart;
}

export function clearCart(): void {
  console.log('Clearing cart');
  setStoredCart(DEFAULT_CART);
}
