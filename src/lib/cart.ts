import { 
  getStoredCart, 
  addItemToCart, 
  updateCartItemQuantity, 
  removeCartItem, 
  clearCart 
} from './cart/storage';
import { syncCartWithServer, syncCartItem } from './cart/sync';
import type { AddToCartInput } from './types/cart';

interface CartAPI {
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (input: AddToCartInput) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  sync: () => Promise<void>;
  getState: () => any;
}

declare global {
  interface Window {
    cart: CartAPI;
  }
}

window.cart = {
  open: () => {
    console.log('Cart: Opening cart');
    window.dispatchEvent(new CustomEvent('cart:open'));
  },

  close: () => {
    console.log('Cart: Closing cart');
    window.dispatchEvent(new CustomEvent('cart:close'));
  },

  toggle: () => {
    console.log('Cart: Toggling cart');
    window.dispatchEvent(new CustomEvent('cart:toggle'));
  },

  add: (input: AddToCartInput) => {
    console.log('Cart: Adding item to cart:', input);
    const updatedCart = addItemToCart(input);
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: updatedCart }));
    
    // Try to sync in background
    syncCartItem(input).catch(error => {
      console.error('Cart: Failed to sync item:', error);
    });
  },

  update: (key, quantity) => {
    console.log('Cart: Updating item quantity:', { key, quantity });
    const updatedCart = updateCartItemQuantity(key, quantity);
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: updatedCart }));
    
    // Try to sync in background
    syncCartWithServer().catch(error => {
      console.error('Cart: Failed to sync cart:', error);
    });
  },

  remove: (key) => {
    console.log('Cart: Removing item:', key);
    const updatedCart = removeCartItem(key);
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: updatedCart }));
    
    // Try to sync in background
    syncCartWithServer().catch(error => {
      console.error('Cart: Failed to sync cart:', error);
    });
  },

  clear: () => {
    console.log('Cart: Clearing cart');
    clearCart();
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: getStoredCart() }));
    
    // Try to sync in background
    syncCartWithServer().catch(error => {
      console.error('Cart: Failed to sync cart:', error);
    });
  },

  sync: async () => {
    console.log('Cart: Syncing with server');
    await syncCartWithServer();
  },

  getState: () => {
    const state = getStoredCart();
    console.log('Cart: Current state:', state);
    return state;
  },
};

export type { CartAPI };
