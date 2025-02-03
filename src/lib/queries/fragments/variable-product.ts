export const variableProductFragment = `
fragment VariableProduct on VariableProduct {
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
  totalSales
  image {
    sourceUrl
    altText
    title
  }
  variations(first: 100) {
    nodes {
      name
      databaseId
      price
      regularPrice
      salePrice
      rawSalePrice: salePrice(format: RAW)
      slug
      stockQuantity
      stockStatus
      hasAttributes
      image {
        sourceUrl
        altText
        title
      }
      attributes {
        nodes {
          name
          attributeId
          value
          label
        }
      }
    }
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
