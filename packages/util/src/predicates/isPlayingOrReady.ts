import { PLAYER_STATUS, PlayerStatusTypes, } from '@pericles/constants';

export default function isPlayingOrReady(status: PlayerStatusTypes): boolean {
  return (
    [ PLAYER_STATUS.PLAYING, PLAYER_STATUS.READY, ] as PlayerStatusTypes[]
  ).includes(status);
}
