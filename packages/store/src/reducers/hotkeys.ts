import { handleActions, } from 'redux-actions';

import { HotkeysActionTypes, } from '../actions/hotkeys';
import { HotkeysState, initialState, } from '../initialState';

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
