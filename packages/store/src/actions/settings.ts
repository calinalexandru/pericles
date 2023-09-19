import { createAction, } from '@reduxjs/toolkit';

import { SettingsState, } from '../initialState';

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
