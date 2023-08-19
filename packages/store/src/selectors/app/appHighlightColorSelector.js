import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appHighlightColorSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.HIGHLIGHT_COLOR, VARIABLES.APP.HIGHLIGHT_COLOR)
  )(state);
}
