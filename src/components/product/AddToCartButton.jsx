import { useState } from 'react';

export default function AddToCartButton({ product, selectedVariation, selectedAttributes, disabled }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (isAdding || disabled) return;
    setIsAdding(true);

    const cartItem = {
      product: {
        id: product.id,
        databaseId: product.databaseId,
        name: product.name,
        slug: product.slug,
        type: product.type,
        price: selectedVariation?.price || product.price,
        image: product.image
      },
      variation: selectedVariation,
      attributes: selectedAttributes,
      quantity: 1
    };

    console.log('Adding to cart:', cartItem);

    try {
      // Add to cart using window bridge
      window.cart.add(cartItem);
      console.log('Successfully added to cart');

      // Open cart using window bridge
      window.cart.open();
      console.log('Cart opened');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || disabled}
      className="w-full inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding to Cart...
        </div>
      ) : (
        <div className="flex items-center">
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {disabled ? 'Select Options' : 'Add to Cart'}
        </div>
      )}
    </button>
  );
}
