import { RootState, } from '../../initialState';

export default function notificationSelector(state: RootState) {
  return state.notification;
}
