import { useState, useEffect } from 'react';
import ProductPrice from './ProductPrice';
import VariationSelector from './VariationSelector';
import AddToCartButton from './AddToCartButton';
import VariationsTable from './VariationsTable';

export default function ProductOptions({ product, initialVariation, initialSelections = {} }) {
  const [selectedVariation, setSelectedVariation] = useState(initialVariation);
  const [selections, setSelections] = useState(initialSelections);
  const [currentPrice, setCurrentPrice] = useState(initialVariation?.price || product.price);
  const isVariable = product.__typename === 'VariableProduct';

  const findMatchingVariation = (selections) => {
    if (!isVariable) return null;
    
    const selectedCount = Object.keys(selections).length;
    const requiredCount = product.variations?.nodes[0]?.attributes.nodes.length || 0;
    
    if (selectedCount !== requiredCount) return null;

    return product.variations?.nodes.find(variation =>
      variation.attributes.nodes.every(attr =>
        selections[attr.name] === attr.value
      )
    );
  };

  const updatePrice = (variation) => {
    console.log('Updating price for variation:', variation);
    if (variation) {
      setCurrentPrice(variation.price);
    } else if (isVariable) {
      const prices = product.variations.nodes
        .map(v => parseFloat(v.price.replace(/[^0-9.]/g, '')))
        .filter(p => !isNaN(p));

      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setCurrentPrice(
          minPrice === maxPrice
            ? `$${minPrice.toFixed(2)}`
            : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`
        );
      } else {
        setCurrentPrice(product.price);
      }
    } else {
      setCurrentPrice(product.price);
    }
  };

  const handleVariationSelect = (newSelections) => {
    console.log('Selecting variation:', newSelections);
    setSelections(newSelections);
    const variation = findMatchingVariation(newSelections);
    setSelectedVariation(variation);
    updatePrice(variation);

    // Update URL with selected attributes
    const params = new URLSearchParams();
    Object.entries(newSelections).forEach(([key, value]) => {
      params.set(key, value);
    });
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  const handleClearSelections = () => {
    console.log('Clearing all selections');
    setSelections({});
    setSelectedVariation(null);
    updatePrice(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  useEffect(() => {
    if (initialVariation) {
      console.log('Initializing with variation:', initialVariation);
      updatePrice(initialVariation);
    }
  }, []);

  if (!isVariable) {
    console.log('Rendering simple product:', product);
    return (
      <div className="space-y-6">
        <ProductPrice 
          price={currentPrice}
          defaultPrice={product.price}
        />
        <AddToCartButton 
          product={product}
          disabled={product.stockStatus !== 'IN_STOCK'}
        />
      </div>
    );
  }

  console.log('Rendering variable product:', {
    product,
    selections,
    selectedVariation
  });

  return (
    <div className="space-y-8">
      <ProductPrice
        price={currentPrice}
        variation={selectedVariation}
        defaultPrice={product.price}
      />

      <VariationSelector
        variations={product.variations.nodes}
        selections={selections}
        onSelect={handleVariationSelect}
        onClear={handleClearSelections}
      />

      <AddToCartButton
        product={product}
        selectedVariation={selectedVariation}
        selectedAttributes={Object.entries(selections).map(([name, value]) => ({
          name,
          value
        }))}
        disabled={!selectedVariation || selectedVariation.stockStatus !== 'IN_STOCK'}
      />

      <VariationsTable
        variations={product.variations.nodes}
        selectedVariation={selectedVariation}
      />
    </div>
  );
}
