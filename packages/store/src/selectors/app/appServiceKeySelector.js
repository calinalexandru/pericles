import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appServiceKeySelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.SERVICE_KEY, VARIABLES.APP.SERVICE_KEY)
  )(state);
}
