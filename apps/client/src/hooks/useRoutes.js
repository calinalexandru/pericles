import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { appActions, } from '@pericles/store';

const { route, } = appActions;
export default function useRoutes() {
  const dispatch = useDispatch();
  const index = useCallback(() => {
    dispatch(route.index());
  }, []);
  const login = useCallback(() => {
    dispatch(route.login());
  }, []);
  const user = useCallback(() => {
    dispatch(route.user());
  }, []);
  return {
    index,
    login,
    user,
  };
}
