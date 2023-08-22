import { combineEpics, ofType, } from 'redux-observable';
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

const { player, } = playerActions;
const { app, } = appActions;

const appInitEpic = (action, state) =>
  action.pipe(
    ofType(app.init),
    tap(() => handleAppInit(state.value)),
    ignoreElements()
  );

const tabClosedEpic = (action, state) =>
  action.pipe(
    ofType(app.tabClosed),
    pluck('payload'),
    filter((tab) => tab === playerTabSelector(state.value)),
    map(player.halt)
  );

const appSetEpic = (action, state) =>
  action.pipe(
    ofType(app.set, app.default),
    pluck('payload'),
    tap((payload) => {
      handleAppSet(state.value, payload);
    }),
    ignoreElements()
  );

const appFactoryResetEpic = (action, state) =>
  action.pipe(
    ofType(app.factoryReset),
    concatMap(() => handleFactoryReset$(state.value))
  );

const appReloadEpic = (action) =>
  action.pipe(ofType(app.reload), tap(handleAppReload), ignoreElements());

export default combineEpics(
  tabClosedEpic,
  appInitEpic,
  appSetEpic,
  appReloadEpic,
  appFactoryResetEpic
);
