import { handleActions, } from 'redux-actions';

import { NotificationActionTypes, } from '../actions/notification';
import { NotificationState, initialState, } from '../initialState';

const { notification: defaultValues, } = initialState;

export default handleActions<NotificationState, Partial<NotificationState>>(
  {
    [NotificationActionTypes.ERROR]: (state, { payload, }) => ({
      type: 'error',
      text: payload.text || '',
    }),
    [NotificationActionTypes.INFO]: (state, { payload, }) => ({
      type: 'info',
      text: payload.text || '',
    }),
    [NotificationActionTypes.SUCCESS]: (state, { payload, }) => ({
      type: 'success',
      text: payload.text || '',
    }),
    [NotificationActionTypes.WARNING]: (state, { payload, }) => ({
      type: 'warning',
      text: payload.text || '',
    }),
    [NotificationActionTypes.CLEAR]: () => ({
      ...defaultValues,
    }),
  },
  defaultValues
);
