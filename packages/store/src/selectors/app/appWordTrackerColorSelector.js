import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appWordTrackerColorSelector(state) {
  return createSelector(
    appSelector,
    propOr(
      DEFAULT_VALUES.APP.WORD_TRACKER_COLOR,
      VARIABLES.APP.WORD_TRACKER_COLOR
    )
  )(state);
}
