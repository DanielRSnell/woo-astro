import type { Cart } from '../../types/cart';

interface CartSummaryProps {
  cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  return (
    <div className="border-t border-border px-6 py-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Subtotal</p>
          <p className="font-medium">{cart.subtotal}</p>
        </div>
        {parseFloat(cart.discountTotal.replace(/[^0-9.-]+/g, '')) > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600">
            <p>Discount</p>
            <p>-{cart.discountTotal}</p>
          </div>
        )}
        {parseFloat(cart.shippingTotal.replace(/[^0-9.-]+/g, '')) > 0 && (
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Shipping</p>
            <p className="font-medium">{cart.shippingTotal}</p>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Tax</p>
          <p className="font-medium">{cart.totalTax}</p>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-base">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">{cart.total}</p>
        </div>
      </div>
      
      <a 
        href="/checkout"
        className="mt-4 block w-full rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
      >
        Proceed to Checkout
      </a>
    </div>
  );
}
