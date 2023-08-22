import { handleActions, } from 'redux-actions';

import { NotificationActionTypes, initialState, } from '@pericles/store';

const { notification: defaultValues, } = initialState;

export default handleActions(
  {
    [NotificationActionTypes.ERROR]: (state, { payload, }) => ({
      type: 'error',
      ...payload,
    }),
    [NotificationActionTypes.INFO]: (state, { payload, }) => ({
      type: 'info',
      ...payload,
    }),
    [NotificationActionTypes.SUCCESS]: (state, { payload, }) => ({
      type: 'success',
      ...payload,
    }),
    [NotificationActionTypes.WARNING]: (state, { payload, }) => ({
      type: 'warning',
      ...payload,
    }),
    [NotificationActionTypes.CLEAR]: () => ({
      ...defaultValues,
    }),
  },
  defaultValues
);
