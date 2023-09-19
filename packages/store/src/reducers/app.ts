import { createAction, createSlice, PayloadAction, } from '@reduxjs/toolkit';

import { ROUTES, } from '@pericles/constants';

import { AppState, initialState, } from '../initialState';

const appSlice = createSlice({
  name: 'app',
  initialState: initialState.app,
  reducers: {
    set: (state, action: PayloadAction<Partial<AppState>>) => {
      Object.assign(state, action.payload);
    },
    routeIndex: (state) => {
      state.route = ROUTES.INDEX;
    },
    routeError: (state) => {
      state.route = ROUTES.ERROR;
    },
    routeErrorPdf: (state) => {
      state.route = ROUTES.ERROR_PDF;
    },
    routeSkip: (state) => {
      state.route = ROUTES.SKIP;
    },
  },
});

const sideEffectActions = {
  tabClosed: createAction<number>('app/tabClosed'),
  init: createAction('app/init'),
  reload: createAction('app/reload'),
  reloadTab: createAction('app/reloadTab'),
  factoryReset: createAction('app/factoryReset'),
  newContent: createAction<any>('app/newContent'),
};

const { actions: reducerActions, reducer, } = appSlice;

export const appActions = { ...reducerActions, ...sideEffectActions, };
export const appReducer = reducer;
