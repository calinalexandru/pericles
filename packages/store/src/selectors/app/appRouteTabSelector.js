import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appRouteTabSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.ROUTE_TAB, VARIABLES.APP.ROUTE_TAB)
  )(state);
}
