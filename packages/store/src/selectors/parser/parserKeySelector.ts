import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import parserSelector from './parserSelector';

export default createSelector(parserSelector, (parser) => parser.key) as (
  state: RootState
) => number;
