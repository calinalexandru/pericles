import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, } from '@pericles/constants';

import parserSelector from './parserSelector';

export default createSelector(
  parserSelector,
  (parser) => parser.iframes || DEFAULT_VALUES.PARSER.IFRAMES
);
