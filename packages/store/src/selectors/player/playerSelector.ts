import { RootState, } from '../../initialState';

export default function playerSelector(state: RootState) {
  return state.player;
}
