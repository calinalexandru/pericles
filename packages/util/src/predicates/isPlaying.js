import { PLAYER_STATUS, } from '@pericles/constants';

export default function isPlaying(status) {
  return PLAYER_STATUS.PLAYING === status;
}
