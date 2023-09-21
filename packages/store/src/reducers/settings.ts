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

const sideEffectActions = {};

const { actions: reducerActions, reducer, } = settingsSlice;

export const settingsActions = { ...reducerActions, ...sideEffectActions, };
export const settingsReducer = reducer;
