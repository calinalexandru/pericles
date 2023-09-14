import { PauseSharp, PlayArrowSharp, } from '@mui/icons-material';
import { LoadingButton, } from '@mui/lab';
import { SxProps, } from '@mui/material';
import React, { useCallback, useMemo, } from 'react';
import { useSelector, } from 'react-redux';

import usePlayer from '@/hooks/usePlayer';
import { PLAYER_STATUS, PlayerStatusTypes, } from '@pericles/constants';
import { playerBufferingSelector, playerStatusSelector, } from '@pericles/store';

const pausedState = [ PLAYER_STATUS.PAUSED, ] as PlayerStatusTypes[];
const pauseState = [ PLAYER_STATUS.PLAYING, ] as PlayerStatusTypes[];
const playState = [
  PLAYER_STATUS.STOPPED,
  PLAYER_STATUS.ERROR,
  PLAYER_STATUS.READY,
  PLAYER_STATUS.PAUSED,
] as PlayerStatusTypes[];
const loadingButtonSx = { p: 2, borderRadius: 0, } as SxProps;
const largeIconSx = {
  fontSize: '1.9rem',
};

export default function PlayButton() {
  const { play, resume, pause, } = usePlayer();
  const status = useSelector(playerStatusSelector);
  const buffering = useSelector(playerBufferingSelector);
  const loadingAudio = useMemo(
    () =>
      (
        [ PLAYER_STATUS.LOADING, PLAYER_STATUS.WAITING, ] as PlayerStatusTypes[]
      ).includes(status) || buffering,
    [ status, buffering, ]
  );
  const isDisabledPlay = useMemo(
    () =>
      (
        [ PLAYER_STATUS.LOADING, PLAYER_STATUS.WAITING, ] as PlayerStatusTypes[]
      ).includes(status),
    [ status, ]
  );

  const playOrParse = useCallback(() => {
    // console.log(playOrParse');
    if (pausedState.includes(status)) resume();
    else if (playState.includes(status)) play({ userGenerated: true, });
    else if (pauseState.includes(status)) pause();
  }, [ status, resume, play, pause, ]);

  const playIcon = useMemo(() => {
    if (
      (
        [ PLAYER_STATUS.READY, PLAYER_STATUS.PAUSED, ] as PlayerStatusTypes[]
      ).includes(status)
    ) {
      return <PlayArrowSharp sx={largeIconSx} />;
    }
    if (status === PLAYER_STATUS.PLAYING) {
      return <PauseSharp sx={largeIconSx} />;
    }
    return <PlayArrowSharp sx={largeIconSx} />;
  }, [ status, ]);

  return (
    <LoadingButton
      disabled={isDisabledPlay}
      fullWidth={true}
      onClick={playOrParse}
      color="secondary"
      size="large"
      loading={loadingAudio}
      sx={loadingButtonSx}
    >
      {playIcon}
    </LoadingButton>
  );
}
