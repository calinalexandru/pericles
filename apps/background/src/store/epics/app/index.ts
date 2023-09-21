import { getType, } from '@reduxjs/toolkit';
import { Epic, combineEpics, ofType, } from 'redux-observable';
import {
  concatMap,
  filter,
  ignoreElements,
  map,
  pluck,
  tap,
} from 'rxjs/operators';

import { appActions, playerActions, playerTabSelector, } from '@pericles/store';

import {
  handleAppInit,
  handleAppReload,
  handleAppSet,
  handleFactoryReset$,
} from './handlers';

const appInitEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(appActions.init)),
    tap(() => handleAppInit(state.value)),
    ignoreElements()
  );

const tabClosedEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(appActions.tabClosed)),
    pluck('payload'),
    filter((tab) => tab === playerTabSelector(state.value)),
    map(playerActions.halt)
  );

const appSetEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(appActions.set)),
    pluck('payload'),
    tap((payload) => {
      handleAppSet(state.value, payload);
    }),
    ignoreElements()
  );

const appFactoryResetEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(appActions.factoryReset)),
    concatMap(() => handleFactoryReset$(state.value))
  );

const appReloadEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(appActions.reload)),
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
