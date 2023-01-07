## 1. GraphQL

### Scalar types

Scalar types are similar to primitive types in `JavaScript`. They always resolve to concrete data.

GraphQL's default scalar types are:
- `Int`: A signed 32‐bit integer
- `Float`: A signed double-precision floating-point value
- `String`: A UTF‐8 character sequence
- `Boolean`: `true` or `false`
- `ID`: A unique identifier

### Type & Interface

Most of the schema types you define have one or more fields:
```graphql
type Todo {
  id: ID
  title: String
  completed: Boolean
}

type Query {
  todo(id: ID!): Todo
  todos: [Todo]
}
```

```graphql
interface Datetime {
  createdAt: Date!
  updatedAt: Date!
}
```

Type can be implemented from an interface and have the same fields:
```graphql
type Achievement {
  value: String!
}

type User implements Datetime {
  id: ID
  firstName: String!
  lastName: String
  age: Number!
  achievements: [Achievement]
}
```

### Enum & Union

An enum is similar to a scalar type, but its legal values are defined in the schema. Here's an example definition:
```graphql
enum UserPermissions {
  USER
  MODERATOR
  ADMIN
}
```

When you define a union type, you declare which object types are included in the union:
```graphql
type RateProjectNotification {
  id: ID!
  rating: Float!
  author: {
    id: ID!
    username: String!
  }
}

type CommentProjectNotification {
  id: ID!
  comment: String!
  commenter: {
    id: ID!
    username: String!
    firstName: String!
  }
}

union NotificationContent = RateProjectNotification | CommentProjectNotification
```

### Querying a union

GraphQL clients don't know which object type a field will return if the field's return type is a union. To account for this, a query can include the subfields of multiple possible types.

Here's a valid query for the schema above:
```graphql
query GetNotifications {
  notifications {
    ... on RateProjectNotification {
      rating
    }
    
    ... on CommentProjectNotification {
      comment
    }
  }
}
```

### Field nullability

By default, it's valid for any field in your schema to return `null` instead of its specified type. You can require that a particular field doesn't return `null` with an exclamation mark `!`, like so:
```graphql
type User {
  username: String! # Can't return null
  age: Number
}
```

Nullability and lists:
```graphql
type Comment {
  id: ID!
  text: String!
}

type Project {
  comments: [Comment!]! # This array can't be null AND items inside array can't be null
}
```

- If `!` appears inside the square brackets, the returned list can't include items that are `null`.
- If `!` appears outside the square brackets, the list itself can't be `null`.
- In any case, it's valid for a list field to return an empty list.

### Input

Input types are special object types that allow you to provide hierarchical data as arguments to fields:
```graphql
type RegisterType {
  email: String!
  firstName: String!
  lastName: String
  username: String!
  age: Number
  roles: [String!]
}
```

Example of use with mutation:
```graphql
input ProjectCommentInput {
  id: ID!
  author: String!
  text: String!
}

mutation AddComment($input: ProjectCommentInput!) {
  addComment(input: $input) {
    text
  }
}
```

### Fragment

The snippet allows you to get fields based on the specified type. Used as reused fields:
```graphql
type Todo {
  id: ID
  title: String
  completed: Boolean
}

fragment TodoFields on Todo {
  id
  title
  completed
}

query Todo($id: ID!) {
  todo(id: $id) {
    ...TodoFields
  }
}
```

Or you can use inline fragment:
```graphql
query Todo($id: ID!) {
  todo(id: $id) {
    ... on Todo {
      id
      title
      completed
    }
  }
}
```

### Directives

In `GraphQL` there are 2 directives:
- `@include`: include field when `true`
- `@skip`: skip field when `true`

Include:
```graphql
query User($id: String!, $withFriends: Boolean = true) {
  user(id: $id) {
    id
    username
    friends @include(if: $withFriends) {
      username
    }
  }
}
```

Skip:
```graphql
mutation CreateTodo($input: CreateTodoInput!, $skipUser: Boolean = true) {
  createTodo(input: $input) {
    id
    title
    completed
    user @skip(if: $skipUser) {
      id
      name
    }
  }
}
```

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
yarn add @apollo/client graphql
```

#### 2. Initialize ApolloClient

With our dependencies set up, we can now initialize an ApolloClient instance.

[api/index.ts](https://github.com/Orestli/GraphQL/blob/main/src/services/api/index.ts):
```ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: 'LINK_TO_API',
  cache: new InMemoryCache(),
});

export default client;
```

#### 3. Connect your client to NextJS

You connect Apollo Client to React with the `ApolloProvider` component. Similar to React's `Context.Provider`, `ApolloProvider` wraps your application and places Apollo Client on the context, enabling you to access it from anywhere in your component tree.

[_app.tsx](https://github.com/Orestli/GraphQL/blob/main/src/pages/_app.tsx):
```tsx
const App = ({ Component, pageProps }: AppProps) => (
  <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
);

export default App;
```

### gql

To use GraphQL queries in Apollo, we need to write them in a `gql` function.

Let's create a simple query in which we get a todo list.

[query/todos.ts](https://github.com/Orestli/GraphQL/blob/main/src/graphql/query/todos.ts):
```ts
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

Now this request needs to be called. Apollo provides a `useQuery` hook, let's use it.

[use-query.tsx](https://github.com/Orestli/GraphQL/blob/main/src/components/query/use-query.tsx):
```tsx
const UseQuery: React.FC = () => {
  const { loading, data } = useQuery(GET_ALL_TODOS);

  return !loading ? (
    <div>{JSON.stringify(data, null, 2)}</div>
  ) : (
    <Loader />
  );
};
```

```json
{
  "data": {
    "todos": {
      "data": [
        { 
          "title": "delectus aut autem" 
        }
      ]
    }
  }
}
```

#### useLazyQuery

In case we need to call the query ourselves, Apollo provides the `useLazyQuery` hook.

[use-lazy-query.tsx](https://github.com/Orestli/GraphQL/blob/main/src/components/query/use-lazy-query.tsx):
```tsx
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

Polling provides near-real-time synchronization with your server by executing your query periodically at a specified interval.

[use-query-polling.tsx](https://github.com/Orestli/GraphQL/blob/main/src/components/query/use-query-polling.tsx):
```tsx
const UseQueryPolling: React.FC = () => {
  const { loading, data } = useQuery(GET_ALL_TODOS, {
    variables: { limit: 10 },
    pollInterval: 1000,
  });

  return !loading ? <div>{JSON.stringify(data, null, 2)}</div> : <Loader />;
};
```

#### Refetching

Refetching enables you to refresh query results in response to a particular user action, as opposed to using a fixed interval.

[use-query-refetch](https://github.com/Orestli/GraphQL/blob/main/src/components/query/use-query-refetch.tsx):
```tsx
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

Now that we've learned how to query data from backend, the natural next step is to learn how to modify back-end data with mutations.

Mutations act as `POST / DELETE / PUT / PATCH / ...` methods. 
Let's create one for example.

[mutation/create-todo.ts](https://github.com/Orestli/GraphQL/blob/main/src/graphql/mutation/create-todo.ts):
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

[use-mutation.tsx](https://github.com/Orestli/GraphQL/blob/main/src/components/mutation/use-mutation.tsx):
```tsx
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
    }
  }
}
```

#### UseMutation without manually passing props (default values)

The useMutation hook accepts an options object as its second parameter. Here's an example that provides some default values for GraphQL variables.

[use-default-mutation.tsx](https://github.com/Orestli/GraphQL/blob/main/src/components/mutation/use-default-mutation.tsx):
```tsx
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

If you know that after the mutation you need to query for data, you can use `refetchQueries`.

[use-refetch-mutation.tsx](https://github.com/Orestli/GraphQL/blob/main/src/components/mutation/use-refetch-mutation.tsx):
```tsx
const [createTodo] = useMutation(CREATE_TODO, {
  refetchQueries: ['Todos']
});
```
After doing the `createTodo` mutation, the `Todos` query will be automatically triggered

### Subscriptions

Let's write a GraphQL query.

[lift-status-change.ts](https://github.com/Orestli/GraphQL/blob/main/src/graphql/subscription/lift-status-change.ts):
```ts
import { gql } from '@apollo/client';

export const LIFT_STATUS_CHANGE = gql`
  subscription LiftStatusChange {
    liftStatusChange {
      id
      name
      status
    }
  }
`;
```

#### useSubscription

In addition to queries and mutations, GraphQL supports a third operation type: subscriptions.  
Like queries, subscriptions enable you to fetch data. Unlike queries, subscriptions are long-lasting operations that can change their result over time. They can maintain an active connection to your GraphQL server (most commonly via WebSocket), enabling the server to push updates to the subscription's result.

[use-subscription.tsx](https://github.com/Orestli/GraphQL/blob/main/src/components/subscription/use-subscription.tsx):
```tsx
const UseSubscription: React.FC = () => {
  const { data, loading } = useSubscription(LIFT_STATUS_CHANGE);

  return !loading ? (
    <div>
      {data?.liftStatusChange?.name} - {data?.liftStatusChange?.status}
    </div>
  ) : (
    <Loader />
  );
};
```

#

### Links

The Apollo Link library helps you customize the flow of data between Apollo Client and your GraphQL server. You can define your client's network behavior as a chain of link objects that execute in a sequence.  
Each link should represent either a self-contained modification to a GraphQL operation or a side effect.

#### File uploads

Apollo Client doesn't support a file upload feature out of the box.  
If you'd like to enable file upload capabilities, you will have to add a 3rd party package:
```bash
yarn add apollo-upload-client
yarn add -D @types/apollo-upload-client
```

Create a link instance.

[api/index.ts](https://github.com/Orestli/GraphQL/blob/main/src/services/api/index.ts):
```ts
const uploadLink = createUploadLink({
  uri: 'https://graphqlzero.almansi.me/api',
  credentials: 'include',
});
```

Usage example (after modifying the `client` instance):
```tsx
const MUTATION = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file) {
      success
    }
  }
`;

const UploadFile: React.FC () => {
  const [uploadFile] = useMutation(MUTATION);

  const onChange = ({
    target: {
      files: [file],
    },
  }) => uploadFile({ variables: { file } });

  return <input type="file" onChange={onChange} />;
}
```

#### setContext

This link makes it easy to perform the asynchronous lookup of things like authentication tokens and more.

Let's create a context.

[api/index.ts](https://github.com/Orestli/GraphQL/blob/main/src/services/api/index.ts):
```ts
const getMockToken = async () => crypto.randomBytes(16).toString('hex');

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
```

#### onError

Use the onError link to perform custom logic when a GraphQL or network error occurs.  
You pass this link a function that's executed if an operation returns one or more errors.

[api/index.ts](https://github.com/Orestli/GraphQL/blob/main/src/services/api/index.ts):
```ts
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, ...details }) =>
      console.log(`GraphQL Error: Message: ${message}`, details)
    );
  }

  if (networkError) {
    console.log('Network Error: ', networkError);
  }
});
```

Now when an error occurs, `onEror` will catch it and execute our logic.

Now let's handle the case in the code above if the user is not logged in.

[api/index.ts](https://github.com/Orestli/GraphQL/blob/main/src/services/api/index.ts):
```ts
const hasUnauthorized =
  graphQLErrors &&
  graphQLErrors.find((error) => error.message.includes('unauthenticated'));

if (hasUnauthorized && typeof window !== 'undefined') {
  Router.push('/login');
}
```

After creating the links we need, let's combine them together using `from`.

[api/index.ts](https://github.com/Orestli/GraphQL/blob/main/src/services/api/index.ts):
```diff
const client = new ApolloClient({
- uri: 'https://graphqlzero.almansi.me/api',
+ link: from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
}); 
```

## 3. Generator API

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

After generation, the config file codegen.ts will be created in the root of the project (by default), let's add our plugins.

[codegen.ts](https://github.com/Orestli/GraphQL/blob/main/codegen.ts):
```ts
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

### Types

By creating `.graphql` files without a schema, we lose typing. Let's add a plugin that will generate a single graphQL schema from all presented into one file:
```bash
yarn add -D @graphql-codegen/schema-ast
```

Update config.

[codegen.ts](https://github.com/Orestli/GraphQL/blob/main/codegen.ts):
```ts
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

### Generate

Once configured, we are ready to generate the API. Let's use a ready-made script:
```bash
yarn generate-api
```

#
Сongrats! We are done with the generator. At the output, we will get generated tools for working with the API.

**API:** [index.ts](https://github.com/Orestli/GraphQL/blob/main/src/services/generated-api/index.ts) (`src/services/generated-api/index.ts`)  
**Schema:** [schema.graphql](https://github.com/Orestli/GraphQL/blob/main/src/services/generated-api/schema.graphql) (`src/services/generated-api/schema.graphql`)
