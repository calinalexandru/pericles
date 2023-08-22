import { createAction, } from 'redux-actions';

import { NotificationState, } from '../initialState';

export enum NotificationActionTypes {
  INFO = 'NOTIFICATION/INFO',
  ERROR = 'NOTIFICATION/ERROR',
  WARNING = 'NOTIFICATION/WARNING',
  SUCCESS = 'NOTIFICATION/SUCCESS',
  CLEAR = 'NOTIFICATION/CLEAR',
}

export const notificationInfo = createAction<Partial<NotificationState>>(
  NotificationActionTypes.INFO
);

export const notificationError = createAction<Partial<NotificationState>>(
  NotificationActionTypes.ERROR
);

export const notificationWarning = createAction<Partial<NotificationState>>(
  NotificationActionTypes.WARNING
);

export const notificationSuccess = createAction<Partial<NotificationState>>(
  NotificationActionTypes.SUCCESS
);

export const notificationClear = createAction(NotificationActionTypes.CLEAR);
