import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import parserSelector from './appSelector';

export default createSelector(
  parserSelector,
  (parser) => parser.skipUntilY
) as (state: RootState) => number;
