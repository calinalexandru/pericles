import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appActiveTabSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.ACTIVE_TAB, VARIABLES.APP.ACTIVE_TAB)
  )(state);
}
