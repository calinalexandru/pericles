import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import settingsSelector from './settingsSelector';

export default function settingsNeuralVoicesSelector(state) {
  return createSelector(
    settingsSelector,
    propOr(
      DEFAULT_VALUES.SETTINGS.NEURAL_VOICES,
      VARIABLES.SETTINGS.NEURAL_VOICES
    )
  )(state);
}
