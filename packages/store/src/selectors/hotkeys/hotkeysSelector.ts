import { RootState, } from '../../initialState';

export default function hotkeysSelector(state: RootState) {
  return state.hotkeys;
}
