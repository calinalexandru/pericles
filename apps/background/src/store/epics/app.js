// /* eslint-disable no-unused-vars */
import { i18n, } from '@lingui/core';
import { isEmpty, pick, } from 'ramda';
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

import Speech from '@/speech';
import { MESSAGES, VARIABLES, } from '@pericles/constants';
import {
  appActions,
  appSelector,
  hotkeysActions,
  initialState,
  notificationActions,
  playerActions,
  playerTabSelector,
  settingsActions,
  settingsPitchSelector,
  settingsRateSelector,
  settingsVoiceSelector,
  settingsVoicesSelector,
  settingsVolumeSelector,
} from '@pericles/store';
import {
  getBrowserAPI,
  getEnglishVoiceKey,
  LocalStorage,
  mpToContent,
} from '@pericles/util';

const { player, } = playerActions;
const { app, highlight, } = appActions;
const { settings, } = settingsActions;
const { notification, } = notificationActions;
const { hotkeys, } = hotkeysActions;

const appInitEpic = (action, state) =>
  action.pipe(
    ofType(app.init),
    tap(() => {
      console.log('app.init');
      try {
        Speech.setVolume(settingsVolumeSelector(state.value));
        Speech.setPitch(settingsPitchSelector(state.value));
        Speech.setRate(settingsRateSelector(state.value));
        Speech.setVoice(settingsVoiceSelector(state.value));
      } catch (e) {
        console.warn('speech init failed', e);
      }
      i18n.load(MESSAGES);
    }),
    ignoreElements()
  );

const tabClosedEpic = (action, state) =>
  action.pipe(
    ofType(app.tabClosed),
    pluck('payload', 'tab'),
    filter((tab) => tab === playerTabSelector(state.value)),
    map(() => player.halt())
  );

const appSetEpic = (action, state) =>
  action.pipe(
    ofType(app.set, app.default),
    pluck('payload'),
    tap((payload = {}) => {
      console.log('app.set', payload);
      const appObj = {
        ...appSelector(state.value),
      };
      LocalStorage.merge(appObj)
        .then((response) => {
          console.log('storage is merged', response);
        })
        .catch((e) => console.error(e));

      if (
        !isEmpty(
          pick(
            [ VARIABLES.APP.HIGHLIGHT_COLOR, VARIABLES.APP.WORD_TRACKER_COLOR, ],
            payload
          )
        )
      ) {
        console.log('app.set -> highlight.reloadSettings');
        mpToContent(highlight.reloadSettings());
      }

      if (!isEmpty(pick([ VARIABLES.APP.SERVICE_REGION, ], payload))) {
        Speech.setServiceRegion(payload.serviceRegion);
      }

      if (!isEmpty(pick([ VARIABLES.APP.LANGUAGE, ], payload))) {
        i18n.activate(payload[VARIABLES.APP.LANGUAGE]);
      }
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
