import { PLAYER_STATUS, } from '@pericles/constants';

export default function isPaused(status: number): boolean {
  return PLAYER_STATUS.PAUSED === status;
}
