import { combineEpics, ofType, } from 'redux-observable';
import { of, } from 'rxjs';
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
  playerActions,
  settingsActions,
  notificationActions,
  hotkeysActions,
  playerTabSelector,
  settingsVoicesSelector,
  initialState,
} from '@pericles/store';
import {
  getBrowserAPI,
  getEnglishVoiceKey,
  LocalStorage,
} from '@pericles/util';

import { handleAppInit, handleAppSet, } from './handlers';

const { player, } = playerActions;
const { app, } = appActions;
const { settings, } = settingsActions;
const { notification, } = notificationActions;
const { hotkeys, } = hotkeysActions;

const appInitEpic = (action, state) =>
  action.pipe(
    ofType(app.init),
    tap(() => handleAppInit(state)),
    ignoreElements()
  );

const tabClosedEpic = (action, state) =>
  action.pipe(
    ofType(app.tabClosed),
    pluck('payload', 'tab'),
    filter((tab) => tab === playerTabSelector(state.value)),
    map(player.halt)
  );

const appSetEpic = (action, state) =>
  action.pipe(
    ofType(app.set, app.default),
    pluck('payload'),
    tap((payload) => {
      handleAppSet(state, payload);
    }),
    ignoreElements()
  );

const appFactoryResetEpic = (action, state) =>
  action.pipe(
    ofType(app.factoryReset),
    concatMap(() => {
      const {
        app: appDefaultValues,
        settings: settingsDefaultValues,
        hotkeys: hotkeysDefaultValues,
      } = initialState;
      LocalStorage.clearAll();
      console.log('appFactoryResetEpic');
      return of(
        app.set(appDefaultValues),
        settings.set({
          ...settingsDefaultValues,
          voice: getEnglishVoiceKey(settingsVoicesSelector(state.value)),
        }),
        hotkeys.set(hotkeysDefaultValues),
        notification.info({ text: 'Your setting have been reset.', }),
        app.reload()
      );
    })
  );

const appReloadEpic = (action) =>
  action.pipe(
    ofType(app.reload),
    tap(() => {
      const { api, } = getBrowserAPI();
      console.log('appReloadEpic', api);
      api.runtime.reload();
    }),
    ignoreElements()
  );

export default combineEpics(
  tabClosedEpic,
  appInitEpic,
  appSetEpic,
  appReloadEpic,
  appFactoryResetEpic
);
