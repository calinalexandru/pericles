import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appHighlightStyleSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.HIGHLIGHT_STYLE, VARIABLES.APP.HIGHLIGHT_STYLE)
  )(state);
}
