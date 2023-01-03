import { GET_ALL_TODOS } from '@graphql/query';
import { useLazyQuery } from '@apollo/client';
import Loader from '../loader';

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

export default UseLazyQuery;
