import { GET_ALL_TODOS } from '@graphql/query';
import { useQuery } from '@apollo/client';
import Loader from '../loader';

const UseQueryPolling: React.FC = () => {
  const { loading, data } = useQuery(GET_ALL_TODOS, {
    variables: { limit: 10 },
    pollInterval: 1000,
  });

  return !loading ? <div>{JSON.stringify(data, null, 2)}</div> : <Loader />;
};

export default UseQueryPolling;
