export const getProductQuery = createQuery(`
  query getProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      ... on SimpleProduct {
        name
        databaseId
        id
        slug
        sku
        description
        shortDescription
        price
        regularPrice
        salePrice
        stockStatus
        averageRating
        reviewCount
        onSale
        productCategories {
          nodes {
            name
            slug
            databaseId
          }
        }
        image {
          sourceUrl
          altText
          title
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
            title
          }
        }
      }
      ... on VariableProduct {
        name
        databaseId
        id
        slug
        sku
        description
        shortDescription
        price
        regularPrice
        salePrice
        stockStatus
        averageRating
        reviewCount
        onSale
        productCategories {
          nodes {
            name
            slug
            databaseId
          }
        }
        image {
          sourceUrl
          altText
          title
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
            title
          }
        }
        variations {
          nodes {
            price
            regularPrice
            salePrice
            stockStatus
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`);
