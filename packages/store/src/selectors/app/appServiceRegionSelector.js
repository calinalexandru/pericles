import { propOr, } from 'ramda';
import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, VARIABLES, } from '@pericles/constants';

import appSelector from './appSelector';

export default function appServiceRegionSelector(state) {
  return createSelector(
    appSelector,
    propOr(DEFAULT_VALUES.APP.SERVICE_REGION, VARIABLES.APP.SERVICE_REGION)
  )(state);
}
