import { createSelector, } from 'reselect';

import { RoutesTypes, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import appSelector from './appSelector';

export default createSelector(appSelector, (app) => app.route) as (
  state: RootState
) => RoutesTypes;
