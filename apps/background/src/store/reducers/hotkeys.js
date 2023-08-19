import { handleActions, } from 'redux-actions';

import { initialState, hotkeysActions, } from '@pericles/store';

const { hotkeys, } = hotkeysActions;
const { hotkeys: defaultValues, } = initialState;

export default handleActions(
  {
    [hotkeys.set]: (state, { payload, }) => ({
      ...state,
      ...payload,
    }),
    [hotkeys.default]: () => ({
      ...defaultValues,
    }),
  },
  defaultValues
);
