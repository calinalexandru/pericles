import { handleActions, } from 'redux-actions';

import { SettingsActionTypes, initialState, } from '@pericles/store';

const { settings: defaultValues, } = initialState;

export default handleActions(
  {
    [SettingsActionTypes.SET]: (state, { payload, }) => ({
      ...state,
      ...payload,
    }),
    [SettingsActionTypes.DEFAULT]: () => ({
      ...defaultValues,
    }),
  },
  defaultValues
);
