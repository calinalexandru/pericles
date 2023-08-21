import { i18n, } from '@lingui/core';
import { isEmpty, pick, } from 'ramda';

import Speech from '@/speech';
import { MESSAGES, VARIABLES, } from '@pericles/constants';
import { 
  appActions, 
  appSelector, 
  settingsPitchSelector, 
  settingsRateSelector, 
  settingsVoiceSelector, 
  settingsVolumeSelector,
} from '@pericles/store';
import { LocalStorage, mpToContent, } from '@pericles/util';

const {  highlight, } = appActions;

export function handleAppInit(state) {
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
}

export function handleAppSet(state, payload = {}) {
  console.log('app.set', payload);
  const appObj = {
    ...appSelector(state.value),
  };
  LocalStorage.merge(appObj)
    .then((response) => {
      console.log('storage is merged', response);
    })
    .catch((e) => console.error(e));

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
