import { handleActions, } from 'redux-actions';

import { ROUTES, } from '@pericles/constants';
import {
  AppActionTypes,
  RouteActionTypes,
  initialState,
  AppState,
} from '@pericles/store';

const { app: defaultValues, } = initialState;

export default handleActions<AppState, Action<Partial<AppState>>>(
  {
    [AppActionTypes.SET]: (state, { payload, }) => ({
      ...state,
      ...payload,
    }),
    [RouteActionTypes.INDEX]: (state) => ({ ...state, route: ROUTES.INDEX, }),
    [RouteActionTypes.ERROR]: (state) => ({ ...state, route: ROUTES.ERROR, }),
    [RouteActionTypes.ERROR_PDF]: (state) => ({
      ...state,
      route: ROUTES.ERROR_PDF,
    }),
    [RouteActionTypes.SKIP]: (state) => ({ ...state, route: ROUTES.SKIP, }),
  },
  defaultValues
);
