import { createSelector, } from 'reselect';

import { WordTrackerStylesTypes, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import appSelector from './appSelector';

export default createSelector(appSelector, (app) => app.wordTrackerStyle) as (
  state: RootState
) => WordTrackerStylesTypes;
