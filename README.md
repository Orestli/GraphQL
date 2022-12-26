## 1. GraphQL

## 2. Front-end

### 2. 1. Native JavaScript
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

### 2. 2. Apollo (NextJS)
Apollo Client is a state management library that simplifies managing remote and local data with GraphQL.

### Get started
#### 1. Install dependencies

Applications that use Apollo Client require the following dependencies:
```bash
# yarn
yarn add @apollo/client graphql

# npm
npm install @apollo/client graphql

# pnpm
pnpm install @apollo/client graphql
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

#### 3. Connect your client to NextJS

You connect Apollo Client to React with the `ApolloProvider` component. Similar to React's `Context.Provider`, `ApolloProvider` wraps your application and places Apollo Client on the context, enabling you to access it from anywhere in your component tree:
```tsx
// _app.tsx

const App = ({ Component, pageProps }: AppProps) => (
  <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
);

export default App;
```

### Queries

Let's create a simple query in which we get a todo list
```ts
// query/todos.ts

import { gql } from '@apollo/client';

export const GET_ALL_TODOS = gql`
  query Todos($limit: Int = 5) {
    todos(options: { paginate: { limit: $limit } }) {
      data {
        title
      }
    }
  }
`;
```

Now this request needs to be called. Apollo provides a `useQuery` hook, let's use it:
```tsx
const Component: React.FC = () => {
  const { data } = useQuery(GET_ALL_TODOS);

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
```

In case we need to call the query ourselves, Apollo provides the `useLazyQuery` hook:
```tsx
const Component: React.FC = () => {
  const [getTodos, { data }] = useLazyQuery(GET_ALL_TODOS, {
    variables: {
      limit: 10,
    },
  });

  return (
    <div>
      <button onClick={() => getTodos()}>Make lazy request</button>
      {data && JSON.stringify(data, null, 2)}
    </div>
  );
};
```


### Mutations

### Subscriptions
