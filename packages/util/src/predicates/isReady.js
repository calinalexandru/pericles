import { PLAYER_STATUS, } from '@pericles/constants';

export default function isReady(status) {
  return PLAYER_STATUS.READY === status;
}
