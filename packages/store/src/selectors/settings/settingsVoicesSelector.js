import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import settingsSelector from './settingsSelector';

export default function settingsVoicesSelector(state) {
  return createSelector(
    settingsSelector,
    propOr(DEFAULT_VALUES.SETTINGS.VOICES, VARIABLES.SETTINGS.VOICES)
  )(state);
}
