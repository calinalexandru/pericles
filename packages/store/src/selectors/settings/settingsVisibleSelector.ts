import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import settingsSelector from './settingsSelector';

export default createSelector(
  settingsSelector,
  (settings) => settings.visible
) as (state: RootState) => boolean;
