import { getType, } from '@reduxjs/toolkit';
import { combineEpics, ofType, } from 'redux-observable';
import {
  concatMap,
  filter,
  ignoreElements,
  map,
  pluck,
  tap,
} from 'rxjs/operators';

import {
  appActions,
  EpicFunction,
  playerActions,
  playerTabSelector,
} from '@pericles/store';

import {
  handleAppInit,
  handleAppReload,
  handleAppSet,
  handleFactoryReset$,
} from './handlers';

const appInitEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(appActions.init)),
    tap(() => handleAppInit(state.value)),
    ignoreElements()
  );

const tabClosedEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(appActions.tabClosed)),
    pluck('payload'),
    filter((tab) => tab === playerTabSelector(state.value)),
    map(() => playerActions.halt())
  );

const appSetEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(appActions.set)),
    pluck('payload'),
    tap((payload) => {
      handleAppSet(payload);
    }),
    ignoreElements()
  );

const appFactoryResetEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(appActions.factoryReset)),
    concatMap(() => handleFactoryReset$(state.value))
  );

const appReloadEpic: EpicFunction = (action) =>
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
