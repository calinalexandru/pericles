import { createSelector, } from 'reselect';

import { DEFAULT_VALUES, PlayerSectionsType, } from '@pericles/constants';

import { RootState, } from '../../initialState';

import playerSelector from './playerSelector';

export default createSelector(
  playerSelector,
  (player) => player.sections || DEFAULT_VALUES.PLAYER.SECTIONS
) as (state: RootState) => PlayerSectionsType[];
