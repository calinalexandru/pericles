import { i18n, } from '@lingui/core';
import { isEmpty, pick, } from 'ramda';
import { of, } from 'rxjs';

import Speech from '@/speech';
import { MESSAGES, VARIABLES, } from '@pericles/constants';
import {
  appActions,
  hotkeysActions,
  initialState,
  notificationActions,
  playerActions,
  setSettings,
  settingsPitchSelector,
  settingsRateSelector,
  settingsVoiceSelector,
  settingsVoicesSelector,
  settingsVolumeSelector,
} from '@pericles/store';
import { getBrowserAPI, getEnglishVoiceKey, mpToContent, } from '@pericles/util';

const { highlight, } = appActions;
const { app, } = appActions;
const { player, } = playerActions;
const { notification, } = notificationActions;
const { hotkeys, } = hotkeysActions;

export function handleAppInit(state) {
  console.log('app.init');
  try {
    Speech.setVolume(settingsVolumeSelector(state));
    Speech.setPitch(settingsPitchSelector(state));
    Speech.setRate(settingsRateSelector(state));
    Speech.setVoice(settingsVoiceSelector(state));
  } catch (e) {
    console.warn('speech init failed', e);
  }
  i18n.load(MESSAGES);
}

export function handleAppSet(state, payload = {}) {
  console.log('app.set', payload);

  const highlightSettings = pick(
    [ VARIABLES.APP.HIGHLIGHT_COLOR, VARIABLES.APP.WORD_TRACKER_COLOR, ],
    payload
  );
  if (!isEmpty(highlightSettings)) {
    console.log('app.set -> highlight.reloadSettings');
    mpToContent(highlight.reloadSettings());
  }

  if (!isEmpty(pick([ VARIABLES.APP.SERVICE_REGION, ], payload))) {
    Speech.setServiceRegion(payload.serviceRegion);
  }

  if (!isEmpty(pick([ VARIABLES.APP.LANGUAGE, ], payload))) {
    i18n.activate(payload[VARIABLES.APP.LANGUAGE]);
  }
}

export const handleFactoryReset$ = (state) => {
  const {
    player: playerDefaultValues,
    app: appDefaultValues,
    settings: settingsDefaultValues,
    hotkeys: hotkeysDefaultValues,
  } = initialState;
  console.log('appFactoryResetEpic');
  return of(
    app.set(appDefaultValues),
    player.set(playerDefaultValues),
    setSettings({
      ...settingsDefaultValues,
      voice: getEnglishVoiceKey(settingsVoicesSelector(state)),
    }),
    hotkeys.set(hotkeysDefaultValues),
    notification.info({ text: 'Your setting have been reset.', }),
    app.reload()
  );
};

export const handleAppReload = () => {
  const { api, } = getBrowserAPI();
  console.log('appReloadEpic', api);
  api.runtime.reload();
};
