import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appSkipDeadSectionsSelector(state) {
  return createSelector(
    appSelector,
    propOr(
      DEFAULT_VALUES.APP.SKIP_DEAD_SECTIONS,
      VARIABLES.APP.SKIP_DEAD_SECTIONS
    )
  )(state);
}
