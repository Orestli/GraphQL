import Loader from '@components/loader';
import { useSubscription } from '@apollo/client';
import { LIFT_STATUS_CHANGE } from '@graphql/subscription';

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

export default UseSubscription;
