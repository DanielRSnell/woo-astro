import type { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const handleQuantityChange = (quantity: number) => {
    window.cart.update(item.key, quantity);
  };

  const handleRemove = () => {
    window.cart.remove(item.key);
  };

  return (
    <div className="flex gap-4 p-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        {item.product.image ? (
          <img
            src={item.product.image.sourceUrl}
            alt={item.product.image.altText || item.product.name}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium">
          <h3>
            <a href={`/product/${item.product.slug}`} className="hover:underline">
              {item.product.name}
            </a>
          </h3>
          <p className="ml-4">{item.variation?.price || item.product.price}</p>
        </div>
        
        {item.attributes && item.attributes.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {item.attributes.map((attr) => (
              <span key={attr.name} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {attr.name}: {attr.value}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center gap-3">
            <label htmlFor={`quantity-${item.key}`} className="sr-only">Quantity</label>
            <select 
              id={`quantity-${item.key}`}
              className="rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleRemove}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
            aria-label={`Remove ${item.product.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
