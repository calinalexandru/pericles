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
  AppActionTypes,
  playerActions,
  playerTabSelector,
} from '@pericles/store';

import {
  handleAppInit,
  handleAppReload,
  handleAppSet,
  handleFactoryReset$,
} from './handlers';

const { player, } = playerActions;

const appInitEpic = (action, state) =>
  action.pipe(
    ofType(AppActionTypes.INIT),
    tap(() => handleAppInit(state.value)),
    ignoreElements()
  );

const tabClosedEpic = (action, state) =>
  action.pipe(
    ofType(AppActionTypes.TAB_CLOSED),
    pluck('payload'),
    filter((tab) => tab === playerTabSelector(state.value)),
    map(player.halt)
  );

const appSetEpic = (action, state) =>
  action.pipe(
    ofType(AppActionTypes.SET, AppActionTypes.DEFAULT),
    pluck('payload'),
    tap((payload) => {
      handleAppSet(state.value, payload);
    }),
    ignoreElements()
  );

const appFactoryResetEpic = (action, state) =>
  action.pipe(
    ofType(AppActionTypes.FACTORY_RESET),
    concatMap(() => handleFactoryReset$(state.value))
  );

const appReloadEpic = (action) =>
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
