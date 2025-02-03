export function handleGraphQLErrors(errors: any[]) {
  if (errors && errors.length > 0) {
    console.error('GraphQL Errors:', errors);
    throw new Error(errors[0].message || 'Unknown GraphQL error');
  }
}
