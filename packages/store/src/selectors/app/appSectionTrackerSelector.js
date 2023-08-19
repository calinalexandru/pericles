import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appSectionTrackerSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.SECTIONS_TRACKER, VARIABLES.APP.SECTION_TRACKER)
  )(state);
}
