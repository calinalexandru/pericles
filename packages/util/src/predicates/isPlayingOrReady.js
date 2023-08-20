import { PLAYER_STATUS, } from '@pericles/constants';

export default function isPlayingOrReady(status) {
  return [ PLAYER_STATUS.PLAYING, PLAYER_STATUS.READY, ].includes(status);
}
