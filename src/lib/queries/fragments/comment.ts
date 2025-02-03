export const commentFragment = `
fragment Comment on Comment {
  content
  id
  date
  author {
    node {
      name
      avatar {
        url
      }
    }
  }
}
`;
