import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appThemeModeSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.THEME_MODE, VARIABLES.APP.THEME_MODE)
  )(state);
}
