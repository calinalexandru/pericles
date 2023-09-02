import { createSelector, } from 'reselect';

import { TabsTypes, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import appSelector from './appSelector';

export default createSelector(appSelector, (app) => app.routeTab) as (
  state: RootState
) => TabsTypes;
