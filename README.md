## 1. GraphQL

## 2. GraphQL Playground

## 3. Front-end

### 3. 1. Native JavaScript
You can interact with GraphQL not only through third-party libraries, but also through pure JavaScript.
To do this, we'll create a wrapper that will accept a Queri string and execute a request:

```ts
const makeRequest = (query: string) =>
  fetch("https://rickandmortyapi.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((res) => res.json());
```

Let me remind you and clarify a few points:
1. The request method must always be `POST`;
2. Headers should have `Content-Type` with value `application/json`.

Let's use our wrapper and make a query request:

```ts
const { data } = await makeRequest(`
  query Character($id: ID = 1) {
    character(id: $id) {
      id
      name
      status
      location {
        name
        dimension
      }
    }
  }
`);

console.log(data);
```
```ts
{
  "character": {
    "id": "1",
    "name": "Rick Sanchez",
    "status": "Alive",
    "location": {
      "name": "Citadel of Ricks",
      "dimension": "unknown"
    }
  }
}
```

### 3. 2. Apollo (NextJS)
Description

#### 1. Dependencies

Applications that use Apollo Client require the following dependencies:
```bash
# yarn
yarn add @apollo/client graphql

# npm
npm install @apollo/client graphql

# pnpm
pnpm @apollo/client graphql
```

#### 2. Initialize ApolloClient

With our dependencies set up, we can now initialize an ApolloClient instance:
```ts
// client.ts

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: 'LINK_TO_API',
  cache: new InMemoryCache(),
});

export default client;
```

#### 3. Connect client to NextJS

```tsx
// _app.tsx

const App = ({ Component, pageProps }: AppProps) => (
  <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
);

export default App;
```
