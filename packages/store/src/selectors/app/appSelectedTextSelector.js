import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appSelectedTextSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.SELECTED_TEXT, VARIABLES.APP.SELECTED_TEXT)
  )(state);
}
