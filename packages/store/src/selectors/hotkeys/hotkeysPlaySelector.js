import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import hotkeysSelector from './hotkeysSelector';

export default function hotkeysPlaySelector(state) {
  return createSelector(
    hotkeysSelector,
    propOr(DEFAULT_VALUES.HOTKEYS.PLAY, VARIABLES.HOTKEYS.PLAY)
  )(state);
}
