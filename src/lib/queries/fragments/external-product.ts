export const externalProductFragment = `
fragment ExternalProduct on ExternalProduct {
  name
  slug
  type
  databaseId
  id
  averageRating
  reviewCount
  price
  externalUrl
  buttonText
  image {
    sourceUrl
    altText
    title
  }
}
`;
