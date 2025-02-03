export function createProductStore(product, searchParams) {
  return {
    product,
    isVariable: product.__typename === 'VariableProduct',
    attributes: {},
    variations: product.variations?.nodes || [],
    selected: {},
    currentImage: product.image?.sourceUrl,

    init() {
      if (this.isVariable) {
        this.initializeAttributes();
        this.initializeFromUrl(searchParams);
      }
    },

    initializeAttributes() {
      this.attributes = this.variations.reduce((acc, variation) => {
        variation.attributes.nodes.forEach(attr => {
          if (!acc[attr.name]) {
            acc[attr.name] = new Set();
          }
          acc[attr.name].add(attr.value);
        });
        return acc;
      }, {});

      Object.keys(this.attributes).forEach(key => {
        this.attributes[key] = Array.from(this.attributes[key]);
      });
    },

    initializeFromUrl(searchParams) {
      const params = new URLSearchParams(searchParams);
      Object.keys(this.attributes).forEach(attrName => {
        const value = params.get(attrName);
        if (value) {
          this.selected[attrName] = value;
        }
      });
    },

    setImage(url) {
      this.currentImage = url;
    },

    selectAttribute(name, value) {
      if (!this.isAvailable(name, value)) return;
      this.selected[name] = value;
      this.updateUrl();
    },

    isSelected(name, value) {
      return this.selected[name] === value;
    },

    isAvailable(attrName, attrValue) {
      return this.variations.some(variation => {
        const matchesSelected = Object.entries(this.selected).every(([name, value]) => {
          if (name === attrName) return true;
          const attr = variation.attributes.nodes.find(a => a.name === name);
          return !value || (attr && attr.value === value);
        });

        if (!matchesSelected) return false;

        const attr = variation.attributes.nodes.find(a => a.name === attrName);
        return attr && attr.value === attrValue;
      });
    },

    get matchingVariation() {
      if (!this.isVariable) return null;
      
      const selectedCount = Object.keys(this.selected).length;
      const requiredCount = Object.keys(this.attributes).length;
      
      if (selectedCount !== requiredCount) return null;

      return this.variations.find(variation =>
        variation.attributes.nodes.every(attr =>
          this.selected[attr.name] === attr.value
        )
      );
    },

    get validVariations() {
      return this.variations.filter(variation => variation.price);
    },

    get displayPrice() {
      const variation = this.matchingVariation;
      if (variation) return variation.price;

      if (this.isVariable) {
        const prices = this.variations
          .map(v => this.extractPrice(v.price))
          .filter(p => p !== null);

        if (!prices.length) return 'Price not available';

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return minPrice === maxPrice
          ? `$${minPrice.toFixed(2)}`
          : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
      }

      return this.product.price;
    },

    get canAddToCart() {
      if (!this.isVariable) return this.product.stockStatus === 'IN_STOCK';
      
      const variation = this.matchingVariation;
      return variation && variation.stockStatus === 'IN_STOCK';
    },

    get addToCartText() {
      if (!this.isVariable) {
        return this.product.stockStatus === 'IN_STOCK' ? 'Add to Cart' : 'Out of Stock';
      }

      if (!this.matchingVariation) return 'Select options';
      return this.matchingVariation.stockStatus === 'IN_STOCK' ? 'Add to Cart' : 'Out of Stock';
    },

    updateUrl() {
      const params = new URLSearchParams();
      Object.entries(this.selected).forEach(([name, value]) => {
        params.set(name, value);
      });
      
      const newUrl = `${window.location.pathname}${params.toString() ? '?' : ''}${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    },

    formatAttributeName(name) {
      return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    extractPrice(priceStr) {
      if (!priceStr) return null;
      const matches = priceStr.match(/[\d.]+/);
      return matches ? parseFloat(matches[0]) : null;
    },

    addToCart() {
      const selectedVariation = this.matchingVariation;
      const itemToAdd = selectedVariation || this.product;
      
      const cartEvent = new CustomEvent('add-to-cart', {
        detail: {
          product: itemToAdd,
          quantity: 1
        }
      });
      
      window.dispatchEvent(cartEvent);
    }
  };
}
