import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import parserSelector from './parserSelector';

export default function parserTypeSelector(state) {
  return createSelector(
    parserSelector,
    propOr(DEFAULT_VALUES.PARSER.TYPE, VARIABLES.PARSER.TYPE)
  )(state);
}
