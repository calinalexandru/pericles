import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import playerSelector from './playerSelector';

export default function playerTabSelector(state) {
  return createSelector(
    playerSelector,
    propOr(DEFAULT_VALUES.PLAYER.TAB, VARIABLES.PLAYER.TAB)
  )(state);
}
