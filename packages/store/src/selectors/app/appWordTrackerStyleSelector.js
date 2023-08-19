import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appWordTrackerStyleSelector(state) {
  return createSelector(
    appSelector,
    propOr(
      DEFAULT_VALUES.APP.WORD_TRACKER_STYLE,
      VARIABLES.APP.WORD_TRACKER_STYLE
    )
  )(state);
}
