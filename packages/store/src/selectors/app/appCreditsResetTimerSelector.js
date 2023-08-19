import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appCreditsResetTimerSelector(state) {
  return createSelector(
    appSelector,
    propOr(
      DEFAULT_VALUES.APP.CREDITS_RESET_TIMER,
      VARIABLES.APP.CREDITS_RESET_TIMER
    )
  )(state);
}
