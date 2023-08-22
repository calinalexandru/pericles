import { handleActions, } from 'redux-actions';

import { initialState, HotkeysActionTypes, } from '@pericles/store';

const { hotkeys: defaultValues, } = initialState;

export default handleActions(
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
