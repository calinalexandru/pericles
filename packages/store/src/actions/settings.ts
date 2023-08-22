import { createAction, } from 'redux-actions';

import { SettingsState, } from '../initialState';

import { createAsyncActions, } from './factories';

type SettingsActionPayload = any;
export enum SettingsActionTypes {
  SET = 'SETTINGS/SET',
  DEFAULT = 'SETTINGS/DEFAULT',
}

export const setSettings = createAction<Partial<SettingsState>>(
  SettingsActionTypes.SET
);

export const defaultSettings = createAction<SettingsActionPayload>(
  SettingsActionTypes.DEFAULT
);

export const freeVoice = createAsyncActions<any>('FREE_VOICE');
