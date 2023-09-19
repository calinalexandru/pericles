import { createAction, } from '@reduxjs/toolkit';

import { HotkeysState, } from '../initialState';

export enum HotkeysActionTypes {
  SET = 'HOTKEYS/SET',
  DEFAULT = 'HOTKEYS/DEFAULT',
}

export const setHotkeys = createAction<Partial<HotkeysState>>(
  HotkeysActionTypes.SET
);

export const defaultHotkeys = createAction(HotkeysActionTypes.DEFAULT);
