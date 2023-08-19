import { PLAYER_STATUS, } from '@pericles/constants';

export default function isStopped(status) {
  return PLAYER_STATUS.STOPPED === status;
}
