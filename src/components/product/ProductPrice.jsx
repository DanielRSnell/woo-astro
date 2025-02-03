export default function ProductPrice({ price, variation, defaultPrice }) {
  const isOnSale = variation 
    ? variation.salePrice && variation.salePrice !== variation.regularPrice
    : false;

  return (
    <div className="flex items-baseline gap-4">
      <span className="text-3xl font-bold tracking-tight">{price}</span>
      {isOnSale && (
        <span className="text-lg text-muted-foreground line-through">
          {variation.regularPrice}
        </span>
      )}
    </div>
  );
}
