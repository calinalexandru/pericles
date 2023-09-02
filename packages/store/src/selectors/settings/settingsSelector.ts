import { RootState, } from '../../initialState';

export default function settingsSelector(state: RootState) {
  return state.settings;
}
