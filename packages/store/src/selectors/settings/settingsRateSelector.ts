import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import settingsSelector from './settingsSelector';

export default createSelector(
  settingsSelector,
  (settings) => settings.rate
) as (state: RootState) => number;
