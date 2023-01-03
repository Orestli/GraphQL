import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_TODOS } from '@graphql/query';
import { useState } from 'react';
import { CREATE_TODO } from '@graphql/mutation';
import Loader from '../loader';

interface TodoProps {
  id: string;
  title: string;
  completed: boolean;
}

const UseRefetchMutation: React.FC = () => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  const { data, loading } = useQuery(GET_ALL_TODOS);
  const [createTodo] = useMutation(CREATE_TODO, {
    variables: { input: { title, completed } },
    refetchQueries: ['Todos'],
  });

  return !loading ? (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo();
          setTitle('');
        }}
      >
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
      <ul>
        {data?.todos?.data?.map((todo: TodoProps) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  ) : (
    <Loader />
  );
};

export default UseRefetchMutation;
