## 1. GraphQL

## 2. Front-end

### 2. 1. Native JavaScript
You can interact with GraphQL not only through third-party libraries, but also through pure JavaScript.
To do this, we'll create a wrapper that will accept a query string and execute a request:

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
```json
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

#### gql

To use GraphQL queries in Apollo, we need to write them in a `gql` function.

Let's create a simple query in which we get a todo list:
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

### Queries

#### useQuery

Now this request needs to be called. Apollo provides a `useQuery` hook, let's use it:
```tsx
// use-query.tsx

const UseQuery: React.FC = () => {
  const { loading, data } = useQuery(GET_ALL_TODOS);

  return !loading ? (
    <div>{JSON.stringify(data, null, 2)}</div>
  ) : (
    <Loader />
  );
};
```

#### useLazyQuery

In case we need to call the query ourselves, Apollo provides the `useLazyQuery` hook:
```tsx
// use-lazy-query.tsx

const UseLazyQuery: React.FC = () => {
  const [getTodos, { loading, data }] = useLazyQuery(GET_ALL_TODOS, {
    variables: { limit: 10 },
  });

  return !loading ? (
    <div>
      <button onClick={() => getTodos()}>Make lazy request</button>
      {data && JSON.stringify(data, null, 2)}
    </div>
  ) : (
    <Loader />
  );
};
```

#### Polling

Polling provides near-real-time synchronization with your server by executing your query periodically at a specified interval:
```tsx
// use-query-polling.tsx

const UseQueryPolling: React.FC = () => {
  const { loading, data } = useQuery(GET_ALL_TODOS, {
    variables: { limit: 10 },
    pollInterval: 1000,
  });

  return !loading ? <div>{JSON.stringify(data, null, 2)}</div> : <Loader />;
};
```

#### Refetching

Refetching enables you to refresh query results in response to a particular user action, as opposed to using a fixed interval:
```tsx
// use-query-refetch.tsx

const UseQueryRefetch: React.FC = () => {
  const { loading, data, refetch } = useQuery(GET_ALL_TODOS);

  return !loading ? (
    <div>
      <button onClick={() => refetch({ limit: 20 })}>Refetch query</button>
      {data && JSON.stringify(data, null, 2)}
    </div>
  ) : (
    <Loader />
  );
};
```

### Mutations

Mutations act as `POST / DELETE / PUT / PATCH / ...` methods. 
Let's create one for example:
```ts
import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      completed
    }
  }
`;
```

#### useMutation

```tsx
// use-mutation.tsx

const UseMutation: React.FC = () => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  const [createTodo, { loading }] = useMutation(CREATE_TODO);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTodo({
      variables: {
        input: { title, completed },
      },
    });

    setTitle('');
  };

  return !loading ? (
    <form onSubmit={onSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        type="checkbox"
        checked={completed}
        onChange={(event) => setCompleted(event.currentTarget.checked)}
      />
      <button type="submit">Add Todo</button>
    </form>
  ) : (
    <Loader />
  );
};
```

```json
{
  "data": {
    "createTodo": {
      "id": "201",
      "title": "Test",
      "completed": true,
      "__typename": "Todo"
    }
  }
}
```

#### UseMutation without manually passing props (default values)

The useMutation hook accepts an options object as its second parameter. Here's an example that provides some default values for GraphQL variables:
```tsx
// use-default-mutation.tsx

const [createTodo, { loading }] = useMutation(CREATE_TODO, {
  variables: {
    input: { title, completed: false },
  },
});
```

#### Reset

The mutation result object returned by `useMutation` includes a reset function:
```ts
const [createTodo, { reset }] = useMutation(CREATE_TODO);
```
This function is used to completely reset the mutation (return to the original state)

#### Refetching queries

If you know that after the mutation you need to query for data, you can use `refetchQueries`:
```tsx
// use-refetch-mutation.tsx

const [createTodo] = useMutation(CREATE_TODO, {
  refetchQueries: ['Todos']
});
```
After doing the `createTodo` mutation, the `Todos` query will be automatically triggered

### Subscriptions

## 3. Autogenerator API

The addition will be the generation of the API using the script, let's figure it out.

### Quick start

#### 1. Install dependencies

```bash
yarn add -D @graphql-codegen/cli
```

Let's also install plugins (full list [here](https://the-guild.dev/graphql/codegen/plugins)):
```bash
yarn add -D @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

#### 2. Initialize generator

Let's use the CLI generator and execute the following script:
```bash
yarn graphql-codegen init
```

Question by question, it will guide you through the whole process of setting up a schema, selecting plugins, picking a destination of a generated file, and a lot more.

### Config

After generation, the config file codegen.ts will be created in the root of the project (by default), let's add our plugins:
```ts
// codegen.ts

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://graphqlzero.almansi.me/api',
  documents: 'src/graphql/**/*.graphql',
  generates: {
    'src/services/generated-api/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};
```

### Types?

By creating `.graphql` files without a schema, we lose typing. Let's add a plugin that will generate a single graphQL schema from all presented into one file:
```bash
yarn add -D @graphql-codegen/schema-ast
```

Update config:
```ts
// codegen.ts

'src/services/generated-api/schema.graphql': {
  plugins: ['schema-ast'],
}

const config: CodegenConfig = {
  // ...
  generates: {
    // ...
    'src/services/generated-api/schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}
```

Now, when working with `.graphql` files, we will have typing.

#
Сongrats! We are done with the basic generator setup. At the output, we will get generated tools for working with the API.

**API:** [index.ts]() (`src/services/generated-api/index.ts`)  
**Schema:** [schema.graphql]() (`src/services/generated-api/schema.graphql`)
