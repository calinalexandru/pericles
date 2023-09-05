import { Epic, combineEpics, ofType, } from 'redux-observable';
import { delay, map, } from 'rxjs/operators';

import { NotificationActionTypes, notificationClear, } from '@pericles/store';

const notificationSetEpic: Epic<any> = (action) =>
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
