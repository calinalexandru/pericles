import { handleActions, Action, } from 'redux-actions';

import {
  SettingsActionTypes,
  SettingsState,
  initialState,
} from '@pericles/store';

const { settings: defaultValues, } = initialState;

export default handleActions<SettingsState, Action<Partial<SettingsState>>>(
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
