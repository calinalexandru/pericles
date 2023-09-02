import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import appSelector from './appSelector';

export default createSelector(appSelector, (app) => app.sectionTracker) as (
  state: RootState
) => boolean;
