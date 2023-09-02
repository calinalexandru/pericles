import { createSelector, } from 'reselect';

import { PlayerStatusTypes, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import playerSelector from './playerSelector';

export default createSelector(playerSelector, (player) => player.status) as (
  state: RootState
) => PlayerStatusTypes;
