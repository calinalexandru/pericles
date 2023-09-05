import { handleActions, } from 'redux-actions';

import {
  initialState,
  HotkeysActionTypes,
  HotkeysState,
} from '@pericles/store';

const { hotkeys: defaultValues, } = initialState;

export default handleActions<HotkeysState, Partial<HotkeysState>>(
  {
    [HotkeysActionTypes.SET]: (state, { payload, }) => ({
      ...state,
      ...payload,
    }),
    [HotkeysActionTypes.DEFAULT]: () => ({
      ...defaultValues,
    }),
  },
  defaultValues
);
