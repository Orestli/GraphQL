import { GET_ALL_TODOS } from '@graphql/query';
import { useQuery } from '@apollo/client';
import Loader from '../loader';

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

export default UseQueryRefetch;
