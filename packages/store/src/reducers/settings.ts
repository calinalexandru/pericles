import { handleActions, } from 'redux-actions';

import { SettingsActionTypes, } from '../actions/settings';
import { SettingsState, initialState, } from '../initialState';

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
