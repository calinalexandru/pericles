import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appLanguageSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.LANGUAGE, VARIABLES.APP.LANGUAGE)
  )(state);
}
