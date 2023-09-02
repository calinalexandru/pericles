import { createSelector, } from 'reselect';

import { KeyCombo, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import hotkeysSelector from './hotkeysSelector';

export default createSelector(hotkeysSelector, (hotkeys) => hotkeys.prev) as (
  state: RootState
) => KeyCombo[];
