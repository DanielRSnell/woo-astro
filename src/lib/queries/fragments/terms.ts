export const termsFragment = `
fragment Terms on Product {
  terms(first: 100) {
    nodes {
      taxonomyName
      slug
      name
    }
  }
}
`;
