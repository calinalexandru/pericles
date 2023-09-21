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

const sideEffectActions = {};

const { actions: reducerActions, reducer, } = hotkeysSlice;

export const hotkeysActions = { ...reducerActions, ...sideEffectActions, };
export const hotkeysReducer = reducer;
