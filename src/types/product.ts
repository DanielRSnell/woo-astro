export interface ProductImage {
  sourceUrl: string;
  altText?: string;
  title?: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
  databaseId: number;
  description?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: string;
  regularPrice: string;
  salePrice: string | null;
  stockStatus: string;
  attributes: {
    nodes: ProductAttribute[];
  };
}

export interface Product {
  __typename: string;
  name: string;
  slug: string;
  databaseId: number;
  id: string;
  type: string;
  description?: string;
  shortDescription?: string;
  image: ProductImage;
  galleryImages: {
    nodes: ProductImage[];
  };
  productCategories: {
    nodes: ProductCategory[];
  };
  variations?: {
    nodes: ProductVariation[];
  };
  averageRating: number;
  reviewCount: number;
  stockStatus: string;
  price: string;
  regularPrice: string;
  salePrice: string | null;
}
