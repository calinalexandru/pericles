import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import parserSelector from './appSelector';

export default function appSkipUntilYSelector(state) {
  return createSelector(
    parserSelector,
    propOr(DEFAULT_VALUES.APP.SKIP_UNTIL_Y, VARIABLES.APP.SKIP_UNTIL_Y)
  )(state);
}
