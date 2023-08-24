import { Action, } from 'redux';
import { combineEpics, ofType, Epic, } from 'redux-observable';
import { delay, map, } from 'rxjs/operators';

import {
  NotificationActionTypes,
  NotificationState,
  notificationClear,
} from '@pericles/store';

type NotificationAction = Action<
  NotificationActionTypes,
  Partial<NotificationState>
>;

const notificationSetEpic: Epic<NotificationAction> = (action) =>
  action.pipe(
    ofType(
      NotificationActionTypes.INFO,
      NotificationActionTypes.WARNING,
      NotificationActionTypes.ERROR,
      NotificationActionTypes.SUCCESS
    ),
    delay(6000),
    map(notificationClear)
  );

export default combineEpics(notificationSetEpic);
