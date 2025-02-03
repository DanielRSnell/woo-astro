export const productCategoriesFragment = `
fragment ProductCategories on Product {
  productCategories(first: 100) {
    nodes {
      databaseId
      slug
      name
      count
    }
  }
}
`;
