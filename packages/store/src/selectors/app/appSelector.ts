import { RootState, } from "../../initialState";

export default function appSelector(state: RootState) {
  return state.app;
}
