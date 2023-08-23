import { i18n, } from '@lingui/core';
import { isEmpty, pick, } from 'ramda';
import { of, } from 'rxjs';

import Speech from '@/speech';
import { MESSAGES, VARIABLES, } from '@pericles/constants';
import {
  appReload,
  highlightReloadSettings,
  initialState,
  notificationInfo,
  setApp,
  setHotkeys,
  setPlayer,
  setSettings,
  settingsPitchSelector,
  settingsRateSelector,
  settingsVoiceSelector,
  settingsVoicesSelector,
  settingsVolumeSelector,
} from '@pericles/store';
import { getBrowserAPI, getEnglishVoiceKey, mpToContent, } from '@pericles/util';

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
    mpToContent(highlightReloadSettings());
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
    setApp(appDefaultValues),
    setPlayer(playerDefaultValues),
    setSettings({
      ...settingsDefaultValues,
      voice: getEnglishVoiceKey(settingsVoicesSelector(state)),
    }),
    setHotkeys(hotkeysDefaultValues),
    notificationInfo({ text: 'Your setting have been reset.', }),
    appReload()
  );
};

export const handleAppReload = () => {
  const { api, } = getBrowserAPI();
  console.log('appReloadEpic', api);
  api.runtime.reload();
};
