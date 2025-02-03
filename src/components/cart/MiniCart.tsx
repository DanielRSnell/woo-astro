import { useState, useEffect } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { getStoredCart } from '../../lib/cart/storage';
import type { Cart } from '../../types/cart';

interface MiniCartProps {
  initialCart: Cart;
  initialIsOpen?: boolean;
}

export default function MiniCart({ initialCart, initialIsOpen = false }: MiniCartProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Cart storage changed');
      const updatedCart = getStoredCart();
      setCart(updatedCart);
      console.log('Updated cart:', updatedCart);
    };

    const handleCartUpdate = (event: CustomEvent<Cart>) => {
      console.log('Cart update event received:', event.detail);
      setCart(event.detail);
    };

    const handleToggle = () => {
      console.log('Cart toggle event received');
      setIsOpen(prev => !prev);
    };

    const handleOpen = () => {
      console.log('Cart open event received');
      setIsOpen(true);
    };

    const handleClose = () => {
      console.log('Cart close event received');
      setIsOpen(false);
    };

    window.addEventListener('cart:storage', handleStorageChange);
    window.addEventListener('cart:updated', handleCartUpdate as EventListener);
    window.addEventListener('cart:toggle', handleToggle);
    window.addEventListener('cart:open', handleOpen);
    window.addEventListener('cart:close', handleClose);

    return () => {
      window.removeEventListener('cart:storage', handleStorageChange);
      window.removeEventListener('cart:updated', handleCartUpdate as EventListener);
      window.removeEventListener('cart:toggle', handleToggle);
      window.removeEventListener('cart:open', handleOpen);
      window.removeEventListener('cart:close', handleClose);
    };
  }, []);

  return (
    <div className="fixed min-h-screen inset-0 z-50 pointer-events-none">
      <div 
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`absolute inset-y-0 right-0 w-full sm:w-[400px] bg-background shadow-2xl transform transition-transform duration-300 ease-out pointer-events-auto border-l border-border ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                {cart.contents.itemCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {cart.contents.itemCount} {cart.contents.itemCount === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-md text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Close cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {cart.contents.nodes.length > 0 ? (
              <div className="divide-y divide-border">
                {cart.contents.nodes.map((item) => (
                  <CartItem key={item.key} item={item} />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="max-w-[420px] mx-auto w-full text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                    <svg className="h-10 w-10 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="21" r="1"></circle>
                      <circle cx="19" cy="21" r="1"></circle>
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-8">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {cart.contents.nodes.length > 0 && (
            <CartSummary cart={cart} />
          )}
        </div>
      </div>
    </div>
  );
}
