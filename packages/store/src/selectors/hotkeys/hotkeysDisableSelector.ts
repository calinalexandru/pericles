import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import hotkeysSelector from './hotkeysSelector';

export default createSelector(
  hotkeysSelector,
  (hotkeys) => hotkeys.disable
) as (state: RootState) => boolean;
