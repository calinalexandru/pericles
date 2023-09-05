import { handleActions, } from 'redux-actions';

import {
  SettingsActionTypes,
  SettingsState,
  initialState,
} from '@pericles/store';

const { settings: defaultValues, } = initialState;

export default handleActions<SettingsState, Partial<SettingsState>>(
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
