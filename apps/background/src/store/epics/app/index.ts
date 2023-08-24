import { Epic, combineEpics, ofType, } from 'redux-observable';
import {
  concatMap,
  filter,
  ignoreElements,
  map,
  pluck,
  tap,
} from 'rxjs/operators';

import {
  AppActionTypes,
  AppState,
  playerHalt,
  playerTabSelector,
} from '@pericles/store';

import {
  handleAppInit,
  handleAppReload,
  handleAppSet,
  handleFactoryReset$,
} from './handlers';

type AppAction = Action<AppActionTypes, Partial<AppState>>;

const appInitEpic: Epic<AppAction> = (action, state) =>
  action.pipe(
    ofType(AppActionTypes.INIT),
    tap(() => handleAppInit(state.value)),
    ignoreElements()
  );

const tabClosedEpic: Epic<AppAction> = (action, state) =>
  action.pipe(
    ofType(AppActionTypes.TAB_CLOSED),
    pluck('payload'),
    filter((tab) => tab === playerTabSelector(state.value)),
    map(playerHalt)
  );

const appSetEpic: Epic<AppAction> = (action, state) =>
  action.pipe(
    ofType(AppActionTypes.SET, AppActionTypes.DEFAULT),
    pluck('payload'),
    tap((payload) => {
      handleAppSet(state.value, payload);
    }),
    ignoreElements()
  );

const appFactoryResetEpic: Epic<AppAction> = (action, state) =>
  action.pipe(
    ofType(AppActionTypes.FACTORY_RESET),
    concatMap(() => handleFactoryReset$(state.value))
  );

const appReloadEpic: Epic<AppAction> = (action) =>
  action.pipe(
    ofType(AppActionTypes.RELOAD),
    tap(handleAppReload),
    ignoreElements()
  );

export default combineEpics(
  tabClosedEpic,
  appInitEpic,
  appSetEpic,
  appReloadEpic,
  appFactoryResetEpic
);
