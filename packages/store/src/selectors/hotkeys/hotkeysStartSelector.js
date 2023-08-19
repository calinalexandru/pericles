import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import hotkeysSelector from './hotkeysSelector';

export default function hotkeysStartSelector(state) {
  return createSelector(
    hotkeysSelector,
    propOr(DEFAULT_VALUES.HOTKEYS.START, VARIABLES.HOTKEYS.START)
  )(state);
}
