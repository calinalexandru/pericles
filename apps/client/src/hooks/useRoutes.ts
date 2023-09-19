import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { appActions, } from '@pericles/store';

export default function useRoutes() {
  const dispatch = useDispatch();

  const index = useCallback(() => {
    dispatch(appActions.routeIndex());
  }, [ dispatch, ]);

  return {
    index,
  };
}
