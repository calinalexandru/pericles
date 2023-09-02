import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import settingsSelector from './settingsSelector';

export default createSelector(
  settingsSelector,
  (settings) => settings.pitch
) as (state: RootState) => number;
