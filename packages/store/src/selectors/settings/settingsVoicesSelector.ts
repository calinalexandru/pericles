import { createSelector, } from 'reselect';

import { VoiceType, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import settingsSelector from './settingsSelector';

export default createSelector(
  settingsSelector,
  (settings) => settings.voices
) as (state: RootState) => VoiceType[];
