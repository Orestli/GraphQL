import type { GetServerSideProps, NextPage } from 'next';
import type { TodosQuery } from '@services/generated-api';
import client from '@services/api';
import { GET_ALL_TODOS } from '@graphql/query';

interface Props {
  todos: TodosQuery;
}

const SsrPage: NextPage<Props> = ({ todos }) => (
  <ul>
    {todos.todos?.data?.map((todo) => (
      <li key={todo?.id}>{todo?.title}</li>
    ))}
  </ul>
);

export default SsrPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data } = await client.query({
    query: GET_ALL_TODOS,
    variables: { limit: 15 },
  });

  return {
    props: { todos: data },
  };
};
