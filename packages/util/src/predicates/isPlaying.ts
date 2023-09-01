import { PLAYER_STATUS, } from '@pericles/constants';

export default function isPlaying(status: number): boolean {
  return PLAYER_STATUS.PLAYING === status;
}
