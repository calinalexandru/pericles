import { createSelector, } from 'reselect';

import { ThemeModeTypes, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import appSelector from './appSelector';

export default createSelector(appSelector, (app) => app.themeMode) as (
  state: RootState
) => ThemeModeTypes;
