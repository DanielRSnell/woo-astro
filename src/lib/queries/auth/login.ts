import { createQuery } from '../../graphql-client';

export const loginMutation = createQuery(`
  mutation login($username: String!, $password: String!) {
    login(
      input: {
        provider: PASSWORD
        credentials: {
          username: $username
          password: $password
        }
      }
    ) {
      authToken
      refreshToken
      user {
        name
        username
        email
      }
    }
  }
`);

export async function loginUser(username: string, password: string) {
  try {
    const data = await loginMutation.exec({ username, password });
    return data.login || null;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
