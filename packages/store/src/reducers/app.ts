import { createSlice, PayloadAction, } from '@reduxjs/toolkit';

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
    tabClosed: (appState, _action: PayloadAction<number>) => appState,
    init: (appState) => appState,
    reload: (appState) => appState,
    reloadTab: (appState) => appState,
    factoryReset: (appState) => appState,
    newContent: (appState) => appState,
    autoscrollSet: (appState, _action: PayloadAction<{ section: number }>) =>
      appState,
    autoscrollClear: (appState) => appState,
    highlightSection: (appState) => appState,
    highlightWord: (
      appState,
      _action: PayloadAction<{ charIndex: number; charLength: number }>
    ) => appState,
    highlightReloadSettings: (appState) => appState,
    highlightClearSections: (appState) => appState,
    highlightClearWords: (appState) => appState,
  },
});

export const { actions: appActions, reducer: appReducer, } = appSlice;
