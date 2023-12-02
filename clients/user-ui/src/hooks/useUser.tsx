import { useQuery } from '@apollo/client';
import { GET_USER } from '../graphql/actions/getUser.action';

const useUser = () => {
  const { data, loading } = useQuery(GET_USER);
  return {
    loading,
    user: data?.getLoggedInUser.user,
  };
};

export default useUser;
