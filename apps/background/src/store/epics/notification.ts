import { PayloadAction, getType, } from '@reduxjs/toolkit';
import { Epic, ofType, } from 'redux-observable';
import { delay, map, } from 'rxjs/operators';

import {
  RootState,
  notificationActions,
  combineAnyEpics,
} from '@pericles/store';

const notificationSetEpic: Epic<
  PayloadAction<string>,
  PayloadAction<any>,
  RootState
> = (action) =>
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

export default combineAnyEpics(notificationSetEpic);
