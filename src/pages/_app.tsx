import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '@services/api';

const App = ({ Component, pageProps }: AppProps) => (
  <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
);

export default App;
