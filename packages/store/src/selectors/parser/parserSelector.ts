import { RootState, } from '../../initialState';

export default function parserSelector(state: RootState) {
  return state.parser;
}
