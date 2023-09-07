import { StateObservable, } from 'redux-observable';
import { of, } from 'rxjs';

import Speech from '@/speech';
import { VARIABLES, } from '@pericles/constants';
import {
  RootState,
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

export function handleAppInit(state: RootState): void {
  console.log('app.init');
  try {
    Speech.setVolume(settingsVolumeSelector(state));
    Speech.setPitch(settingsPitchSelector(state));
    Speech.setRate(settingsRateSelector(state));
    Speech.setVoice(settingsVoiceSelector(state));
  } catch (e) {
    console.warn('speech init failed', e);
  }
}

export function handleAppSet(
  state: StateObservable<RootState>,
  payload: any = {}
): void {
  console.log('app.set', payload);

  const highlightSettingsKeys = [
    VARIABLES.APP.HIGHLIGHT_COLOR,
    VARIABLES.APP.WORD_TRACKER_COLOR,
  ];
  const highlightSettings = Object.keys(payload)
    .filter((key) => highlightSettingsKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = payload[key];
      return obj;
    }, {} as { [key: string]: string });

  if (Object.keys(highlightSettings).length > 0) {
    console.log('app.set -> highlight.reloadSettings');
    mpToContent(highlightReloadSettings());
  }
}

export const handleFactoryReset$: any = (state: RootState) => {
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

export const handleAppReload = (): void => {
  const { api, } = getBrowserAPI();
  console.log('appReloadEpic', api);
  api.runtime.reload();
};
