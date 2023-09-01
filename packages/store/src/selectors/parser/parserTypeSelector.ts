import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, ParserTypes, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import parserSelector from './parserSelector';

export default createSelector(
  parserSelector,
  (parser) => parser.type || DEFAULT_VALUES.PARSER.TYPE
) as (state: RootState) => ParserTypes;
