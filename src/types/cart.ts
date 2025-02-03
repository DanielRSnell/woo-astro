export interface CartImage {
  sourceUrl: string;
  altText?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  image?: CartImage;
  type?: 'SIMPLE' | 'VARIABLE';
  price?: string;
}

export interface CartVariation {
  id: string;
  databaseId: number;
  name: string;
  price: string;
  attributes: ProductAttribute[];
}

export interface CartItem {
  key: string;
  quantity: number;
  total: string;
  product: CartProduct;
  variation?: CartVariation;
  attributes?: ProductAttribute[];
}

export interface Cart {
  contents: {
    nodes: CartItem[];
    itemCount: number;
  };
  total: string;
  subtotal: string;
  discountTotal: string;
  shippingTotal: string;
  totalTax: string;
}

export interface AddToCartInput {
  product: CartProduct;
  quantity?: number;
  variation?: CartVariation;
  attributes?: ProductAttribute[];
}
