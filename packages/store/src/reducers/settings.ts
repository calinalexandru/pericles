import { PayloadAction, createSlice, } from '@reduxjs/toolkit';

import { SettingsState, initialState, } from '../initialState';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState.settings,
  reducers: {
    set: (settingsState, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(settingsState, action.payload);
    },
    default: (settingsState) => {
      Object.assign(settingsState, initialState.settings);
    },
  },
});

export const { actions: settingsActions, reducer: settingsReducer, } =
  settingsSlice;
