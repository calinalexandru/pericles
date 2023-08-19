import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import notificationSelector from './notificationSelector';

export default function notificationTextSelector(state) {
  return createSelector(
    notificationSelector,
    propOr(DEFAULT_VALUES.NOTIFICATION.TEXT, VARIABLES.NOTIFICATION.TEXT)
  )(state);
}
