import { getType, } from '@reduxjs/toolkit';
import { combineEpics, ofType, } from 'redux-observable';
import { delay, map, } from 'rxjs/operators';

import { notificationActions, EpicFunction, } from '@pericles/store';

const notificationSetEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(
      getType(notificationActions.info),
      getType(notificationActions.success),
      getType(notificationActions.warning),
      getType(notificationActions.error)
    ),
    delay(6000),
    map(() => notificationActions.clear())
  );

export default combineEpics(notificationSetEpic);
