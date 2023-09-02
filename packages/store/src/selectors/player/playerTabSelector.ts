import { createSelector, } from 'reselect';

import { TabsTypes, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import playerSelector from './playerSelector';

export default createSelector(playerSelector, (player) => player.tab) as (
  state: RootState
) => TabsTypes;
