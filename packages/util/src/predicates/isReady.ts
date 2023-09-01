import { PLAYER_STATUS, } from '@pericles/constants';

export default function isReady(status: number): boolean {
  return PLAYER_STATUS.READY === status;
}
