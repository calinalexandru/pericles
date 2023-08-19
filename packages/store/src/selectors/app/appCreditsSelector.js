import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appCreditsSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.CREDITS, VARIABLES.APP.CREDITS)
  )(state);
}
