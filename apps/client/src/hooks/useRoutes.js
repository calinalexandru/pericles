import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { routeIndex, } from '@pericles/store';

export default function useRoutes() {
  const dispatch = useDispatch();

  const index = useCallback(() => {
    dispatch(routeIndex());
  }, [ dispatch, ]);

  return {
    index,
  };
}
