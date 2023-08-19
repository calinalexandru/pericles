import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import parserSelector from './parserSelector';

export default function parserMaxPageSelector(state) {
  return createSelector(
    parserSelector,
    propOr(DEFAULT_VALUES.PARSER.MAX_PAGE, VARIABLES.PARSER.MAX_PAGE)
  )(state);
}
