import { PLAYER_STATUS, PlayerStatusTypes, } from '@pericles/constants';

export default function isWaiting(status: PlayerStatusTypes): boolean {
  return PLAYER_STATUS.WAITING === status;
}
