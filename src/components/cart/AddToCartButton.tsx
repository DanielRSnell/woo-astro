import { useState } from 'react';
import type { AddToCartInput } from '../../types/cart';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    type?: 'SIMPLE' | 'VARIABLE';
    price?: string;
    image?: {
      sourceUrl: string;
      altText?: string;
    };
  };
  variation?: {
    id: string;
    databaseId: number;
    name: string;
    price: string;
    attributes: Array<{ name: string; value: string; }>;
  };
  attributes?: Array<{ name: string; value: string; }>;
  disabled?: boolean;
}

export default function AddToCartButton({ product, variation, attributes, disabled }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || disabled) return;
    
    setIsAdding(true);
    
    const input: AddToCartInput = {
      product: {
        ...product,
        price: variation?.price || product.price
      }
    };

    if (variation && attributes) {
      input.variation = variation;
      input.attributes = attributes;
    }

    try {
      window.cart.add(input);
      window.cart.open();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // You might want to show an error toast here
    }
    
    setIsAdding(false);
  };

  const buttonText = disabled 
    ? 'Please select options' 
    : isAdding 
      ? 'Adding...' 
      : 'Add to Cart';

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || disabled}
      className="w-full inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {buttonText}
        </>
      )}
    </button>
  );
}
