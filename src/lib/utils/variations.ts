import type { Product, ProductVariation } from '../../types/product';

export function getSelectedAttributes(variations: ProductVariation[], searchParams: URLSearchParams): Record<string, string> {
  const selected: Record<string, string> = {};
  if (!variations?.length) return selected;

  const attributeNames = new Set(
    variations[0].attributes.nodes.map(attr => attr.name)
  );

  attributeNames.forEach(name => {
    const value = searchParams.get(name);
    if (value) selected[name] = value;
  });

  return selected;
}

export function getAvailableOptionsForAttribute(
  variations: ProductVariation[],
  selectedAttrs: Record<string, string>,
  targetAttrName: string
): Set<string> {
  const availableOptions = new Set<string>();
  
  variations.forEach(variation => {
    const matchesSelected = Object.entries(selectedAttrs).every(([name, value]) => {
      if (name === targetAttrName) return true;
      const attr = variation.attributes.nodes.find(a => a.name === name);
      return !value || (attr && attr.value === value);
    });

    if (matchesSelected) {
      const attr = variation.attributes.nodes.find(a => a.name === targetAttrName);
      if (attr) availableOptions.add(attr.value);
    }
  });

  return availableOptions;
}

export function findMatchingVariation(
  variations: ProductVariation[],
  selectedAttrs: Record<string, string>
): ProductVariation | null {
  if (!variations?.length || !selectedAttrs) return null;

  const selectedAttrCount = Object.keys(selectedAttrs).length;
  const requiredAttrCount = variations[0].attributes.nodes.length;

  if (selectedAttrCount !== requiredAttrCount) return null;

  return variations.find(variation =>
    variation.attributes.nodes.every(attr =>
      selectedAttrs[attr.name] === attr.value
    )
  ) || null;
}

export function getPriceRange(product: Product): string {
  if (!product.variations?.nodes?.length) {
    return product.price || 'Price not available';
  }

  const prices = product.variations.nodes
    .map(v => extractPrice(v.price))
    .filter((p): p is number => p !== null);

  if (!prices.length) return 'Price not available';

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return minPrice === maxPrice
    ? `$${minPrice.toFixed(2)}`
    : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
}

export function getAttributeOptions(variations: ProductVariation[]): Record<string, Set<string>> {
  if (!variations?.length) return {};

  const options: Record<string, Set<string>> = {};
  
  variations.forEach(variation => {
    variation.attributes.nodes.forEach(attr => {
      if (!options[attr.name]) {
        options[attr.name] = new Set();
      }
      if (attr.value) {
        options[attr.name].add(attr.value);
      }
    });
  });

  return options;
}

export function formatAttributeName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractPrice(priceStr: string | null): number | null {
  if (!priceStr) return null;
  const matches = priceStr.match(/[\d.]+/);
  return matches ? parseFloat(matches[0]) : null;
}
