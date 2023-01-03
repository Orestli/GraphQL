import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Router from 'next/router';
import * as crypto from 'crypto';

const getMockToken = async () => crypto.randomBytes(16).toString('hex');

const baseHttpLink = new HttpLink({
  uri: 'https://snowtooth.moonhighway.com/',
});

// File uploader
const uploadLink = createUploadLink({
  uri: 'https://graphqlzero.almansi.me/api',
  credentials: 'include',
});

// Headers
const authLink = setContext(async (_, context) => {
  const token = await getMockToken();

  return {
    ...context,
    headers: {
      ...context.headers,
      authorization: token ? `JWT ${token}` : null,
    },
  };
});

// Error handler
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, ...details }) =>
      console.log(`GraphQL Error: Message: ${message}`, details)
    );
  }

  if (networkError) {
    console.log('Network Error: ', networkError);
  }

  const hasUnauthorized =
    graphQLErrors &&
    graphQLErrors.find((error) => error.message.includes('unauthenticated'));

  if (hasUnauthorized && typeof window !== 'undefined') {
    Router.push('/login');
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, baseHttpLink, uploadLink]),
  cache: new InMemoryCache(),
});

export default client;
