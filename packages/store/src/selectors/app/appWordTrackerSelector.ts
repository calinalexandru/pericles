import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import appSelector from './appSelector';

export default createSelector(
  appSelector,
  app => app.wordTracker
) as (state: RootState) => boolean;