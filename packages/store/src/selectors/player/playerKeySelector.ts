import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import playerSelector from './playerSelector';

export default createSelector(playerSelector, (player) => player.key) as (
  state: RootState
) => number;
