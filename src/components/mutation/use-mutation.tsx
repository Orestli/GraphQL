import { useMutation } from '@apollo/client';
import { CREATE_TODO } from '@graphql/mutation';
import { useState } from 'react';
import Loader from '../loader';

const UseMutation: React.FC = () => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  const [createTodo, { loading }] = useMutation(CREATE_TODO);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createTodo({
      variables: {
        input: { title: null, completed },
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

export default UseMutation;
