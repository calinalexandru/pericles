import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import parserSelector from './parserSelector';

export default createSelector(parserSelector, (parser) => parser.end) as (
  state: RootState
) => boolean;
