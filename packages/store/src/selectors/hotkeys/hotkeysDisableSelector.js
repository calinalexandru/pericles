import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import hotkeysSelector from './hotkeysSelector';

export default function hotkeysDisableSelector(state) {
  return createSelector(
    hotkeysSelector,
    propOr(DEFAULT_VALUES.HOTKEYS.DISABLE, VARIABLES.HOTKEYS.DISABLE)
  )(state);
}
