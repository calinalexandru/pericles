import { handleActions, } from 'redux-actions';

import { ROUTES, VARIABLES, } from '@pericles/constants';
import { appActions, initialState, } from '@pericles/store';

const { app, route, credits, } = appActions;
const { app: defaultValues, } = initialState;

export default handleActions(
  {
    [app.set]: (state, { payload, }) => ({
      ...state,
      ...payload,
    }),
    [app.reset]: (state) => ({
      ...state,
      ...defaultValues,
    }),
    [credits.burn]: (state, { payload, }) => ({
      ...state,
      credits: state.credits - payload,
    }),
    [app.selectText]: (state, { payload, }) => ({
      ...state,
      [VARIABLES.APP.SELECTED_TEXT]: payload,
    }),

    [route.index]: (state) => ({ ...state, route: ROUTES.INDEX, }),
    [route.user]: (state) => ({ ...state, route: ROUTES.USER, }),
    [route.login]: (state) => ({ ...state, route: ROUTES.LOGIN, }),
    [route.error]: (state) => ({ ...state, route: ROUTES.ERROR, }),
    [route.errorPdf]: (state) => ({ ...state, route: ROUTES.ERROR_PDF, }),
    [route.cooldown]: (state) => ({ ...state, route: ROUTES.COOLDOWN, }),
    [route.skip]: (state) => ({ ...state, route: ROUTES.SKIP, }),
  },
  defaultValues
);
