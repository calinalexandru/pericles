import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import parserSelector from './parserSelector';

export default createSelector(parserSelector, (parser) => parser.maxPage) as (
  state: RootState
) => number;
