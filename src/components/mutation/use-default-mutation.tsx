import { useMutation } from '@apollo/client';
import { CREATE_TODO } from '@graphql/mutation';
import { useState } from 'react';
import Loader from '../loader';

const UseDefaultMutation: React.FC = () => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  const [createTodo, { loading }] = useMutation(CREATE_TODO, {
    variables: {
      input: { title, completed: false },
    },
  });

  return !loading ? (
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
  ) : (
    <Loader />
  );
};

export default UseDefaultMutation;
