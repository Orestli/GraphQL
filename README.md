<<<<<<< HEAD
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
// api/index.ts

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

Let's write a GraphQL query:
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
```tsx
// use-subscription.tsx

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

Create a link instance:
```ts
// api/index.ts

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
  }) => uploadFile({ variables: { file } })

  return <input type="file" onChange={onChange} />;
}
```

#### setContext

This link makes it easy to perform the asynchronous lookup of things like authentication tokens and more.

Let's create a context:
```ts
// api/index.ts

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

Use the onError link to perform custom logic when a GraphQL or network error occurs. You pass this link a function that's executed if an operation returns one or more errors:
```ts
// api/index.ts

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

Now let's handle the case in the code above if the user is not logged in:
```ts
// api/index.ts

const hasUnauthorized =
  graphQLErrors &&
  graphQLErrors.find((error) => error.message.includes('unauthenticated'));

if (hasUnauthorized && typeof window !== 'undefined') {
  Router.push('/login');
}
```

After creating the links we need, let's combine them together using `from`:
```ts
// api/index.ts

const client = new ApolloClient({
  link: from([errorLink, authLink, uploadLink]),
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

### Types

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

### Generate

Once configured, we are ready to generate the API. Let's use a ready-made script:
```bash
yarn generate-api
```

#
Сongrats! We are done with the generator. At the output, we will get generated tools for working with the API.

**API:** [index.ts]() (`src/services/generated-api/index.ts`)  
**Schema:** [schema.graphql]() (`src/services/generated-api/schema.graphql`)
=======
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
>>>>>>> b1adb12 (Initial commit from Create Next App)
