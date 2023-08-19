import { PLAYER_STATUS, } from '@pericles/constants';

export default function isPaused(status) {
  return PLAYER_STATUS.PAUSED === status;
}
