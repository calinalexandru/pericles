import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import parserSelector from './parserSelector';

export default function parserKeySelector(state) {
  return createSelector(
    parserSelector,
    propOr(DEFAULT_VALUES.PARSER.KEY, VARIABLES.PARSER.KEY)
  )(state);
}
