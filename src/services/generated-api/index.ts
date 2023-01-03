import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: File;
};

export type Address = {
  __typename?: 'Address';
  city: Maybe<Scalars['String']>;
  geo: Maybe<Geo>;
  street: Maybe<Scalars['String']>;
  suite: Maybe<Scalars['String']>;
  zipcode: Maybe<Scalars['String']>;
};

export type AddressInput = {
  city: InputMaybe<Scalars['String']>;
  geo: InputMaybe<GeoInput>;
  street: InputMaybe<Scalars['String']>;
  suite: InputMaybe<Scalars['String']>;
  zipcode: InputMaybe<Scalars['String']>;
};

export type Album = {
  __typename?: 'Album';
  id: Maybe<Scalars['ID']>;
  photos: Maybe<PhotosPage>;
  title: Maybe<Scalars['String']>;
  user: Maybe<User>;
};

export type AlbumPhotosArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type AlbumsPage = {
  __typename?: 'AlbumsPage';
  data: Maybe<Array<Maybe<Album>>>;
  links: Maybe<PaginationLinks>;
  meta: Maybe<PageMetadata>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

export type Comment = {
  __typename?: 'Comment';
  body: Maybe<Scalars['String']>;
  email: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  name: Maybe<Scalars['String']>;
  post: Maybe<Post>;
};

export type CommentsPage = {
  __typename?: 'CommentsPage';
  data: Maybe<Array<Maybe<Comment>>>;
  links: Maybe<PaginationLinks>;
  meta: Maybe<PageMetadata>;
};

export type Company = {
  __typename?: 'Company';
  bs: Maybe<Scalars['String']>;
  catchPhrase: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
};

export type CompanyInput = {
  bs: InputMaybe<Scalars['String']>;
  catchPhrase: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
};

export type CreateAlbumInput = {
  title: Scalars['String'];
  userId: Scalars['ID'];
};

export type CreateCommentInput = {
  body: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
};

export type CreatePhotoInput = {
  thumbnailUrl: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type CreatePostInput = {
  body: Scalars['String'];
  title: Scalars['String'];
};

export type CreateTodoInput = {
  completed: Scalars['Boolean'];
  title: Scalars['String'];
};

export type CreateUserInput = {
  address: InputMaybe<AddressInput>;
  company: InputMaybe<CompanyInput>;
  email: Scalars['String'];
  name: Scalars['String'];
  phone: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
  website: InputMaybe<Scalars['String']>;
};

export type Geo = {
  __typename?: 'Geo';
  lat: Maybe<Scalars['Float']>;
  lng: Maybe<Scalars['Float']>;
};

export type GeoInput = {
  lat: InputMaybe<Scalars['Float']>;
  lng: InputMaybe<Scalars['Float']>;
};

/** A `Lift` is a chairlift, gondola, tram, funicular, pulley, rope tow, or other means of ascending a mountain. */
export type Lift = {
  __typename?: 'Lift';
  /** The number of people that a `Lift` can hold */
  capacity: Scalars['Int'];
  /** The number of feet in elevation that a `Lift` ascends */
  elevationGain: Scalars['Int'];
  /** The unique identifier for a `Lift` (id: "panorama") */
  id: Scalars['ID'];
  /** The name of a `Lift` */
  name: Scalars['String'];
  /** A boolean describing whether a `Lift` is open for night skiing */
  night: Scalars['Boolean'];
  /** The current status for a `Lift`: `OPEN`, `CLOSED`, `HOLD` */
  status: Maybe<LiftStatus>;
  /** A list of trails that this `Lift` serves */
  trailAccess: Array<Trail>;
};

/** An enum describing the options for `LiftStatus`: `OPEN`, `CLOSED`, `HOLD` */
export enum LiftStatus {
  Closed = 'CLOSED',
  Hold = 'HOLD',
  Open = 'OPEN',
}

export type Mutation = {
  __typename?: 'Mutation';
  _: Maybe<Scalars['Int']>;
  createAlbum: Maybe<Album>;
  createComment: Maybe<Comment>;
  createPhoto: Maybe<Photo>;
  createPost: Maybe<Post>;
  createTodo: Maybe<Todo>;
  createUser: Maybe<User>;
  deleteAlbum: Maybe<Scalars['Boolean']>;
  deleteComment: Maybe<Scalars['Boolean']>;
  deletePhoto: Maybe<Scalars['Boolean']>;
  deletePost: Maybe<Scalars['Boolean']>;
  deleteTodo: Maybe<Scalars['Boolean']>;
  deleteUser: Maybe<Scalars['Boolean']>;
  /** Sets a `Lift` status by sending `id` and `status` */
  setLiftStatus: Lift;
  /** Sets a `Trail` status by sending `id` and `status` */
  setTrailStatus: Trail;
  updateAlbum: Maybe<Album>;
  updateComment: Maybe<Comment>;
  updatePhoto: Maybe<Photo>;
  updatePost: Maybe<Post>;
  updateTodo: Maybe<Todo>;
  updateUser: Maybe<User>;
};

export type MutationCreateAlbumArgs = {
  input: CreateAlbumInput;
};

export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};

export type MutationCreatePhotoArgs = {
  input: CreatePhotoInput;
};

export type MutationCreatePostArgs = {
  input: CreatePostInput;
};

export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationDeleteAlbumArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteCommentArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePhotoArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePostArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteTodoArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};

export type MutationSetLiftStatusArgs = {
  id: Scalars['ID'];
  status: LiftStatus;
};

export type MutationSetTrailStatusArgs = {
  id: Scalars['ID'];
  status: TrailStatus;
};

export type MutationUpdateAlbumArgs = {
  id: Scalars['ID'];
  input: UpdateAlbumInput;
};

export type MutationUpdateCommentArgs = {
  id: Scalars['ID'];
  input: UpdateCommentInput;
};

export type MutationUpdatePhotoArgs = {
  id: Scalars['ID'];
  input: UpdatePhotoInput;
};

export type MutationUpdatePostArgs = {
  id: Scalars['ID'];
  input: UpdatePostInput;
};

export type MutationUpdateTodoArgs = {
  id: Scalars['ID'];
  input: UpdateTodoInput;
};

export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  input: UpdateUserInput;
};

export enum OperatorKindEnum {
  Gte = 'GTE',
  Like = 'LIKE',
  Lte = 'LTE',
  Ne = 'NE',
}

export type OperatorOptions = {
  field: InputMaybe<Scalars['String']>;
  kind: InputMaybe<OperatorKindEnum>;
  value: InputMaybe<Scalars['String']>;
};

export type PageLimitPair = {
  __typename?: 'PageLimitPair';
  limit: Maybe<Scalars['Int']>;
  page: Maybe<Scalars['Int']>;
};

export type PageMetadata = {
  __typename?: 'PageMetadata';
  totalCount: Maybe<Scalars['Int']>;
};

export type PageQueryOptions = {
  operators: InputMaybe<Array<InputMaybe<OperatorOptions>>>;
  paginate: InputMaybe<PaginateOptions>;
  search: InputMaybe<SearchOptions>;
  slice: InputMaybe<SliceOptions>;
  sort: InputMaybe<Array<InputMaybe<SortOptions>>>;
};

export type PaginateOptions = {
  limit: InputMaybe<Scalars['Int']>;
  page: InputMaybe<Scalars['Int']>;
};

export type PaginationLinks = {
  __typename?: 'PaginationLinks';
  first: Maybe<PageLimitPair>;
  last: Maybe<PageLimitPair>;
  next: Maybe<PageLimitPair>;
  prev: Maybe<PageLimitPair>;
};

export type Photo = {
  __typename?: 'Photo';
  album: Maybe<Album>;
  id: Maybe<Scalars['ID']>;
  thumbnailUrl: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
};

export type PhotosPage = {
  __typename?: 'PhotosPage';
  data: Maybe<Array<Maybe<Photo>>>;
  links: Maybe<PaginationLinks>;
  meta: Maybe<PageMetadata>;
};

export type Post = {
  __typename?: 'Post';
  body: Maybe<Scalars['String']>;
  comments: Maybe<CommentsPage>;
  id: Maybe<Scalars['ID']>;
  title: Maybe<Scalars['String']>;
  user: Maybe<User>;
};

export type PostCommentsArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type PostsPage = {
  __typename?: 'PostsPage';
  data: Maybe<Array<Maybe<Post>>>;
  links: Maybe<PaginationLinks>;
  meta: Maybe<PageMetadata>;
};

export type Query = {
  __typename?: 'Query';
  /** Returns a `Lift` by `id` (id: "panorama") */
  Lift: Lift;
  /** Returns a `Trail` by `id` (id: "old-witch") */
  Trail: Trail;
  _: Maybe<Scalars['Int']>;
  album: Maybe<Album>;
  albums: Maybe<AlbumsPage>;
  /** A list of all `Lift` objects */
  allLifts: Array<Lift>;
  /** A list of all `Trail` objects */
  allTrails: Array<Trail>;
  comment: Maybe<Comment>;
  comments: Maybe<CommentsPage>;
  /** Returns an `Int` of `Lift` objects with optional `LiftStatus` filter */
  liftCount: Scalars['Int'];
  photo: Maybe<Photo>;
  photos: Maybe<PhotosPage>;
  post: Maybe<Post>;
  posts: Maybe<PostsPage>;
  /** Returns a list of `SearchResult` objects based on `term` or `status` */
  search: Array<SearchResult>;
  todo: Maybe<Todo>;
  todos: Maybe<TodosPage>;
  /** Returns an `Int` of `Trail` objects with optional `TrailStatus` filter */
  trailCount: Scalars['Int'];
  user: Maybe<User>;
  users: Maybe<UsersPage>;
};

export type QueryLiftArgs = {
  id: Scalars['ID'];
};

export type QueryTrailArgs = {
  id: Scalars['ID'];
};

export type QueryAlbumArgs = {
  id: Scalars['ID'];
};

export type QueryAlbumsArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type QueryAllLiftsArgs = {
  status: InputMaybe<LiftStatus>;
};

export type QueryAllTrailsArgs = {
  status: InputMaybe<TrailStatus>;
};

export type QueryCommentArgs = {
  id: Scalars['ID'];
};

export type QueryCommentsArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type QueryLiftCountArgs = {
  status: InputMaybe<LiftStatus>;
};

export type QueryPhotoArgs = {
  id: Scalars['ID'];
};

export type QueryPhotosArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type QueryPostArgs = {
  id: Scalars['ID'];
};

export type QueryPostsArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type QuerySearchArgs = {
  status: InputMaybe<LiftStatus>;
  term: InputMaybe<Scalars['String']>;
};

export type QueryTodoArgs = {
  id: Scalars['ID'];
};

export type QueryTodosArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type QueryTrailCountArgs = {
  status: InputMaybe<TrailStatus>;
};

export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type QueryUsersArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type SearchOptions = {
  q: InputMaybe<Scalars['String']>;
};

/** This union type returns one of two types: a `Lift` or a `Trail`. When we search for a letter, we'll return a list of either `Lift` or `Trail` objects. */
export type SearchResult = Lift | Trail;

export type SliceOptions = {
  end: InputMaybe<Scalars['Int']>;
  limit: InputMaybe<Scalars['Int']>;
  start: InputMaybe<Scalars['Int']>;
};

export type SortOptions = {
  field: InputMaybe<Scalars['String']>;
  order: InputMaybe<SortOrderEnum>;
};

export enum SortOrderEnum {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Listens for changes in lift status */
  liftStatusChange: Maybe<Lift>;
  /** Listens for changes in trail status */
  trailStatusChange: Maybe<Trail>;
};

export type Todo = {
  __typename?: 'Todo';
  completed: Maybe<Scalars['Boolean']>;
  id: Maybe<Scalars['ID']>;
  title: Maybe<Scalars['String']>;
  user: Maybe<User>;
};

export type TodosPage = {
  __typename?: 'TodosPage';
  data: Maybe<Array<Maybe<Todo>>>;
  links: Maybe<PaginationLinks>;
  meta: Maybe<PageMetadata>;
};

/** A `Trail` is a run at a ski resort */
export type Trail = {
  __typename?: 'Trail';
  /** A list of Lifts that provide access to this `Trail` */
  accessedByLifts: Array<Lift>;
  /** The difficulty rating for a `Trail` */
  difficulty: Scalars['String'];
  /** A boolean describing whether or not a `Trail` is groomed */
  groomed: Scalars['Boolean'];
  /** A unique identifier for a `Trail` (id: 'hemmed-slacks') */
  id: Scalars['ID'];
  /** The name of a `Trail` */
  name: Scalars['String'];
  /** A boolean describing whether or not a `Trail` is open for night skiing */
  night: Scalars['Boolean'];
  /** The current status for a `Trail`: OPEN, CLOSED */
  status: Maybe<TrailStatus>;
  /** A boolean describing whether or not a `Trail` has trees */
  trees: Scalars['Boolean'];
};

/** An enum describing the options for `TrailStatus`: `OPEN`, `CLOSED` */
export enum TrailStatus {
  Closed = 'CLOSED',
  Open = 'OPEN',
}

export type UpdateAlbumInput = {
  title: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['ID']>;
};

export type UpdateCommentInput = {
  body: InputMaybe<Scalars['String']>;
  email: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
};

export type UpdatePhotoInput = {
  thumbnailUrl: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  url: InputMaybe<Scalars['String']>;
};

export type UpdatePostInput = {
  body: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
};

export type UpdateTodoInput = {
  completed: InputMaybe<Scalars['Boolean']>;
  title: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  address: InputMaybe<AddressInput>;
  company: InputMaybe<CompanyInput>;
  email: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  phone: InputMaybe<Scalars['String']>;
  username: InputMaybe<Scalars['String']>;
  website: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  address: Maybe<Address>;
  albums: Maybe<AlbumsPage>;
  company: Maybe<Company>;
  email: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  name: Maybe<Scalars['String']>;
  phone: Maybe<Scalars['String']>;
  posts: Maybe<PostsPage>;
  todos: Maybe<TodosPage>;
  username: Maybe<Scalars['String']>;
  website: Maybe<Scalars['String']>;
};

export type UserAlbumsArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type UserPostsArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type UserTodosArgs = {
  options: InputMaybe<PageQueryOptions>;
};

export type UsersPage = {
  __typename?: 'UsersPage';
  data: Maybe<Array<Maybe<User>>>;
  links: Maybe<PaginationLinks>;
  meta: Maybe<PageMetadata>;
};

export type TodoFieldsFragment = {
  __typename?: 'Todo';
  id: string | null;
  title: string | null;
  completed: boolean | null;
};

export type CreateTodoMutationVariables = Exact<{
  input: CreateTodoInput;
}>;

export type CreateTodoMutation = {
  __typename?: 'Mutation';
  createTodo: {
    __typename?: 'Todo';
    id: string | null;
    title: string | null;
    completed: boolean | null;
  } | null;
};

export type TodoQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type TodoQuery = {
  __typename?: 'Query';
  todo: {
    __typename?: 'Todo';
    id: string | null;
    title: string | null;
    completed: boolean | null;
  } | null;
};

export type TodosQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;

export type TodosQuery = {
  __typename?: 'Query';
  todos: {
    __typename?: 'TodosPage';
    data: Array<{
      __typename?: 'Todo';
      id: string | null;
      title: string | null;
      completed: boolean | null;
    } | null> | null;
  } | null;
};

export type LiftStatusChangeSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type LiftStatusChangeSubscription = {
  __typename?: 'Subscription';
  liftStatusChange: {
    __typename?: 'Lift';
    id: string;
    name: string;
    status: LiftStatus | null;
  } | null;
};

export const TodoFieldsFragmentDoc = gql`
  fragment TodoFields on Todo {
    id
    title
    completed
  }
`;
export const CreateTodoDocument = gql`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      completed
    }
  }
`;
export type CreateTodoMutationFn = Apollo.MutationFunction<
  CreateTodoMutation,
  CreateTodoMutationVariables
>;

/**
 * __useCreateTodoMutation__
 *
 * To run a mutation, you first call `useCreateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoMutation, { data, loading, error }] = useCreateTodoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTodoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateTodoMutation,
    CreateTodoMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(
    CreateTodoDocument,
    options
  );
}
export type CreateTodoMutationHookResult = ReturnType<
  typeof useCreateTodoMutation
>;
export type CreateTodoMutationResult =
  Apollo.MutationResult<CreateTodoMutation>;
export type CreateTodoMutationOptions = Apollo.BaseMutationOptions<
  CreateTodoMutation,
  CreateTodoMutationVariables
>;
export const TodoDocument = gql`
  query Todo($id: ID!) {
    todo(id: $id) {
      id
      title
      completed
    }
  }
`;

/**
 * __useTodoQuery__
 *
 * To run a query within a React component, call `useTodoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTodoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTodoQuery(
  baseOptions: Apollo.QueryHookOptions<TodoQuery, TodoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TodoQuery, TodoQueryVariables>(TodoDocument, options);
}
export function useTodoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TodoQuery, TodoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TodoQuery, TodoQueryVariables>(
    TodoDocument,
    options
  );
}
export type TodoQueryHookResult = ReturnType<typeof useTodoQuery>;
export type TodoLazyQueryHookResult = ReturnType<typeof useTodoLazyQuery>;
export type TodoQueryResult = Apollo.QueryResult<TodoQuery, TodoQueryVariables>;
export const TodosDocument = gql`
  query Todos($limit: Int = 5) {
    todos(options: { paginate: { limit: $limit } }) {
      data {
        id
        title
        completed
      }
    }
  }
`;

/**
 * __useTodosQuery__
 *
 * To run a query within a React component, call `useTodosQuery` and pass it any options that fit your needs.
 * When your component renders, `useTodosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodosQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useTodosQuery(
  baseOptions?: Apollo.QueryHookOptions<TodosQuery, TodosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TodosQuery, TodosQueryVariables>(
    TodosDocument,
    options
  );
}
export function useTodosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TodosQuery, TodosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TodosQuery, TodosQueryVariables>(
    TodosDocument,
    options
  );
}
export type TodosQueryHookResult = ReturnType<typeof useTodosQuery>;
export type TodosLazyQueryHookResult = ReturnType<typeof useTodosLazyQuery>;
export type TodosQueryResult = Apollo.QueryResult<
  TodosQuery,
  TodosQueryVariables
>;
export const LiftStatusChangeDocument = gql`
  subscription LiftStatusChange {
    liftStatusChange {
      id
      name
      status
    }
  }
`;

/**
 * __useLiftStatusChangeSubscription__
 *
 * To run a query within a React component, call `useLiftStatusChangeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useLiftStatusChangeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLiftStatusChangeSubscription({
 *   variables: {
 *   },
 * });
 */
export function useLiftStatusChangeSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    LiftStatusChangeSubscription,
    LiftStatusChangeSubscriptionVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    LiftStatusChangeSubscription,
    LiftStatusChangeSubscriptionVariables
  >(LiftStatusChangeDocument, options);
}
export type LiftStatusChangeSubscriptionHookResult = ReturnType<
  typeof useLiftStatusChangeSubscription
>;
export type LiftStatusChangeSubscriptionResult =
  Apollo.SubscriptionResult<LiftStatusChangeSubscription>;
