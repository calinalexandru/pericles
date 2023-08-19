import { PLAYER_STATUS, } from '@pericles/constants';

export default function isWaiting(status) {
  return PLAYER_STATUS.WAITING === status;
}
