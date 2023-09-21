import { of, } from 'rxjs';

import Speech from '@/speech';
import { VARIABLES, } from '@pericles/constants';
import {
  AppState,
  RootState,
  appActions,
  hotkeysActions,
  initialState,
  notificationActions,
  playerActions,
  settingsActions,
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

export function handleAppSet(payload: Partial<AppState>): void {
  console.log('app.set', payload);

  const highlightSettingsKeys = [
    VARIABLES.APP.HIGHLIGHT_COLOR,
    VARIABLES.APP.WORD_TRACKER_COLOR,
  ];
  const highlightSettings = Object.keys(payload)
    .filter((key) => highlightSettingsKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = (payload as any)[key];
      return obj;
    }, {} as { [key: string]: string });

  if (Object.keys(highlightSettings).length > 0) {
    console.log('app.set -> highlight.reloadSettings');
    mpToContent(appActions.highlightReloadSettings());
  }
}

export const handleFactoryReset$ = (state: RootState) => {
  const {
    player: playerDefaultValues,
    app: appDefaultValues,
    settings: settingsDefaultValues,
  } = initialState;
  console.log('appFactoryResetEpic');
  return of(
    appActions.set(appDefaultValues),
    playerActions.set(playerDefaultValues),
    settingsActions.set({
      ...settingsDefaultValues,
      voice: getEnglishVoiceKey(settingsVoicesSelector(state)),
    }),
    hotkeysActions.default(),
    notificationActions.info('Your setting have been reset.'),
    appActions.reload()
  );
};

export const handleAppReload = (): void => {
  const { api, } = getBrowserAPI();
  console.log('appReloadEpic', api);
  api.runtime.reload();
};
