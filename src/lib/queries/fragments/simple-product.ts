export const simpleProductFragment = `
fragment SimpleProduct on SimpleProduct {
  name
  slug
  type
  databaseId
  id
  averageRating
  reviewCount
  price
  rawPrice: price(format: RAW)
  date
  regularPrice
  rawRegularPrice: regularPrice(format: RAW)
  salePrice
  rawSalePrice: salePrice(format: RAW)
  stockStatus
  stockQuantity
  lowStockAmount
  weight
  length
  width
  height
  onSale
  virtual
  image {
    sourceUrl
    altText
    title
  }
  galleryImages(first: 20) {
    nodes {
      sourceUrl
      altText
      title
    }
  }
}
`;
