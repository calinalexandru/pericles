import { handleActions, } from 'redux-actions';

import { initialState, notificationActions, } from '@pericles/store';

const { notification, } = notificationActions;
const { notification: defaultValues, } = initialState;

export default handleActions(
  {
    [notification.error]: (state, { payload, }) => ({
      type: 'error',
      ...payload,
    }),
    [notification.info]: (state, { payload, }) => ({
      type: 'info',
      ...payload,
    }),
    [notification.success]: (state, { payload, }) => ({
      type: 'success',
      ...payload,
    }),
    [notification.warning]: (state, { payload, }) => ({
      type: 'warning',
      ...payload,
    }),
    [notification.clear]: () => ({
      ...defaultValues,
    }),
  },
  defaultValues
);
