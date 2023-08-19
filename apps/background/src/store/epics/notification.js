// /* eslint-disable no-unused-vars */
import { combineEpics, ofType, } from 'redux-observable';
import { delay, map, } from 'rxjs/operators';

import { notificationActions, } from '@pericles/store';

const { notification, } = notificationActions;

const notificationSetEpic = (action) =>
  action.pipe(
    ofType(
      notification.info,
      notification.warning,
      notification.error,
      notification.success
    ),
    delay(6000),
    map(() => notification.clear())
  );

export default combineEpics(notificationSetEpic);
