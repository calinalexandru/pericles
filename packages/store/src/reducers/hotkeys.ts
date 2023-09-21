import { PayloadAction, createSlice, } from '@reduxjs/toolkit';

import { AppState, initialState, } from '../initialState';

const hotkeysSlice = createSlice({
  name: 'hotkeys',
  initialState: initialState.hotkeys,
  reducers: {
    set: (hotkeysState, action: PayloadAction<Partial<AppState>>) => {
      Object.assign(hotkeysState, action.payload);
    },
    default: (hotkeysState) => {
      Object.assign(hotkeysState, initialState.hotkeys);
    },
  },
});

export const { actions: hotkeysActions, reducer: hotkeysReducer, } =
  hotkeysSlice;
