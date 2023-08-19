import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appThemeModeSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.SCHOLAR_MODE, VARIABLES.APP.SCHOLAR_MODE)
  )(state);
}
