export default function VariationsTable({ variations, selectedVariation }) {
  const validVariations = variations.filter(variation => variation.price);
  
  if (!validVariations.length) return null;

  const attributes = validVariations[0].attributes.nodes.map(attr => ({
    name: attr.name,
    label: attr.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }));

  return (
    <div className="rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {attributes.map(attr => (
                <th key={attr.name} className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {attr.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {validVariations.map((variation, index) => (
              <tr 
                key={variation.id || index}
                className={`
                  border-b border-border last:border-0
                  ${selectedVariation?.id === variation.id ? 'bg-primary/5' : ''}
                `}
              >
                {attributes.map(attr => (
                  <td key={attr.name} className="px-4 py-3 text-sm">
                    {variation.attributes.nodes.find(a => a.name === attr.name)?.value || '-'}
                  </td>
                ))}
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">{variation.price}</span>
                    {variation.salePrice && variation.salePrice !== variation.regularPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {variation.regularPrice}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`
                    inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                    ${variation.stockStatus === 'IN_STOCK' 
                      ? 'bg-[var(--color-success-light)]/10 text-[var(--color-success)]'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {variation.stockStatus === 'IN_STOCK' ? 'In stock' : 'Out of stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
