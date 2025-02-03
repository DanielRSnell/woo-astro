export interface GraphQLRequestOptions {
  variables?: Record<string, any>;
  headers?: Record<string, string>;
}

export async function request(
  query: string, 
  options: GraphQLRequestOptions = {}
) {
  const endpoint = import.meta.env.WORDPRESS_GRAPHQL_ENDPOINT;

  if (!endpoint) {
    throw new Error('GraphQL endpoint is not configured');
  }

  // Log the query and variables for debugging
  console.log('GraphQL Query:', query);
  console.log('GraphQL Variables:', JSON.stringify(options.variables, null, 2));

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      body: JSON.stringify({ 
        query,
        variables: options.variables || {} 
      })
    });

    const result = await response.json();

    // Log the full response for debugging
    // console.log('GraphQL Response:', JSON.stringify(result, null, 2));

    if (result.errors) {
      // Log all errors for debugging
      console.error('GraphQL Errors:', result.errors);
      
      // Check for specific error about unsupported product type
      const typeError = result.errors.find(
        (error) => error.message.includes('bundle') || 
                   error.message.includes('product type')
      );

      if (typeError) {
        console.warn('Unsupported product type, returning null');
        return { product: null };
      }

      // For other errors, throw the first error
      throw new Error(result.errors[0].message || 'Unknown GraphQL error');
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    
    // Return null for product queries to prevent complete failure
    if (error.message.includes('product')) {
      return { product: null };
    }

    throw error;
  }
}

export function createQuery(queryString: string) {
  return {
    query: queryString,
    exec: async (variables = {}) => {
      try {
        // Log the query and variables before execution
        console.log('Executing Query:', queryString);
        console.log('Query Variables:', JSON.stringify(variables, null, 2));

        const result = await request(queryString, { variables });
        
        // Log the result
        console.log('Query Result:', JSON.stringify(result, null, 2));

        return result;
      } catch (error) {
        console.error('Query Execution Error:', error);
        // Return a structure that matches expected response
        return { 
          product: null,
          products: { nodes: [], pageInfo: {} }
        };
      }
    }
  };
}
