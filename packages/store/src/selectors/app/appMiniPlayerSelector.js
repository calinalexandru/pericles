import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appMiniPlayerSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.MINI_PLAYER, VARIABLES.APP.MINI_PLAYER)
  )(state);
}
