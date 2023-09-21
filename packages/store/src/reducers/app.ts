import { createAction, createSlice, PayloadAction, } from '@reduxjs/toolkit';

import { ROUTES, } from '@pericles/constants';

import { AppState, initialState, } from '../initialState';

const appSlice = createSlice({
  name: 'app',
  initialState: initialState.app,
  reducers: {
    set: (appState, action: PayloadAction<Partial<AppState>>) => {
      Object.assign(appState, action.payload);
    },
    routeIndex: (appState) => {
      appState.route = ROUTES.INDEX;
    },
    routeError: (appState) => {
      appState.route = ROUTES.ERROR;
    },
    routeErrorPdf: (appState) => {
      appState.route = ROUTES.ERROR_PDF;
    },
    routeSkip: (appState) => {
      appState.route = ROUTES.SKIP;
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
  autoscrollSet: createAction<{ section: number }>('app/autoscrollSet'),
  autoscrollClear: createAction('app/autoscrollClear'),
  highlightSection: createAction('app/highlightSection'),
  highlightWord: createAction<any>('app/highlightWord'),
  highlightClearWords: createAction('app/highlightClearWords'),
  highlightClearSections: createAction('app/highlightClearSections'),
  highlightReloadSettings: createAction('app/highlightReloadSettings'),
};

const { actions: reducerActions, reducer, } = appSlice;

export const appActions = { ...reducerActions, ...sideEffectActions, };
export const appReducer = reducer;
