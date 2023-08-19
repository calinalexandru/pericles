import { handleActions, } from 'redux-actions';

import { settingsActions, initialState, } from '@pericles/store';

const { settings, } = settingsActions;
const { settings: defaultValues, } = initialState;

export default handleActions(
  {
    [settings.set]: (state, { payload, }) => ({
      ...state,
      ...payload,
    }),
    [settings.default]: () => ({
      ...defaultValues,
    }),
  },
  defaultValues
);
