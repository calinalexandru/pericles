import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import playerSelector from './playerSelector';

export default createSelector(playerSelector, (player) => player.buffering) as (
  state: RootState
) => boolean;
