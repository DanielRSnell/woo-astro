const ENDPOINT = import.meta.env.WORDPRESS_GRAPHQL_ENDPOINT;

export async function checkGraphQLStatus(): Promise<boolean> {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query HealthCheck { 
          generalSettings { 
            url 
          }
        }`
      }),
    });

    const data = await response.json();
    console.log(`GraphQL Endpoint Status (${ENDPOINT}):`, response.ok ? 'Online' : 'Offline');
    return response.ok && !data.errors;
  } catch (error) {
    console.error(`GraphQL Endpoint (${ENDPOINT}) is offline:`, error);
    return false;
  }
}

export async function graphqlRequest<T = any>(query: string, variables = {}): Promise<T> {
  if (!ENDPOINT) {
    throw new Error('WORDPRESS_GRAPHQL_ENDPOINT is not configured');
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(Array.isArray(errors) 
      ? errors[0].message 
      : 'GraphQL Error occurred');
  }

  return data;
}
