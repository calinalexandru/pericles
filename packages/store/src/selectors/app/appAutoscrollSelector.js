import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appAutoscrollSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.AUTOSCROLL, VARIABLES.APP.AUTOSCROLL)
  )(state);
}
