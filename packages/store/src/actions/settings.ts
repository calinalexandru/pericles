import { createAction, } from 'redux-actions';

import { SettingsState, } from '../initialState';

type SettingsActionPayload = any;
export enum SettingsActionTypes {
  SET = 'SETTINGS/SET',
  SET_FREE_VOICE = 'SETTINGS/SET_FREE_VOICE',
  DEFAULT = 'SETTINGS/DEFAULT',
}

export const setSettings = createAction<Partial<SettingsState>>(
  SettingsActionTypes.SET
);
export const setFreeVoice = createAction<SettingsActionPayload>(
  SettingsActionTypes.SET_FREE_VOICE
);
export const defaultSettings = createAction<SettingsActionPayload>(
  SettingsActionTypes.DEFAULT
);
