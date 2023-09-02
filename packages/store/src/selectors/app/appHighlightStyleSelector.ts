import { createSelector, } from 'reselect';

import { SectionHighlightStylesTypes, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import appSelector from './appSelector';

export default createSelector(appSelector, (app) => app.highlightStyle) as (
  state: RootState
) => SectionHighlightStylesTypes;
