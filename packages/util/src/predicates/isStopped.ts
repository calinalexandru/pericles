import { PLAYER_STATUS, PlayerStatusTypes, } from '@pericles/constants';

export default function isStopped(status: PlayerStatusTypes): boolean {
  return PLAYER_STATUS.STOPPED === status;
}
