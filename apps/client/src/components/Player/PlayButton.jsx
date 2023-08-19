import { PauseSharp, PlayArrowSharp, } from '@mui/icons-material';
import { LoadingButton, } from '@mui/lab';
import React, { useCallback, useMemo, } from 'react';
import { useSelector, } from 'react-redux';

import usePlayer from '@/hooks/usePlayer';
import { PLAYER_STATUS, } from '@pericles/constants';
import { playerBufferingSelector, playerStatusSelector, } from '@pericles/store';

export default function PlayButton() {
  const { play, resume, pause, } = usePlayer();
  const status = useSelector(playerStatusSelector);
  const buffering = useSelector(playerBufferingSelector);
  const largeIcon = {
    fontSize: '1.9rem',
  };
  const pausedState = [ PLAYER_STATUS.PAUSED, ];
  const playState = [
    PLAYER_STATUS.STOPPED,
    PLAYER_STATUS.ERROR,
    PLAYER_STATUS.READY,
    PLAYER_STATUS.PAUSED,
  ];
  const pauseState = [ PLAYER_STATUS.PLAYING, ];
  const loadingAudio = useMemo(
    () =>
      [ PLAYER_STATUS.LOADING, PLAYER_STATUS.WAITING, ].includes(status) ||
      buffering,
    [ status, buffering, ]
  );
  const isDisabledPlay = useMemo(
    () => [ PLAYER_STATUS.LOADING, PLAYER_STATUS.WAITING, ].includes(status),
    [ status, ]
  );
  const playOrParse = useCallback(() => {
    // console.log(playOrParse');
    if (pausedState.includes(status)) resume();
    else if (playState.includes(status)) play({ userGenerated: true, });
    else if (pauseState.includes(status)) pause();
  }, [ status, ]);

  const playIcon = useMemo(() => {
    if ([ PLAYER_STATUS.READY, PLAYER_STATUS.PAUSED, ].includes(status)) {
      return <PlayArrowSharp sx={largeIcon} />;
    }
    if (status === PLAYER_STATUS.PLAYING) {
      return <PauseSharp sx={largeIcon} />;
    }
    return <PlayArrowSharp sx={largeIcon} />;
  }, [ status, ]);

  return (
    <LoadingButton
      disabled={isDisabledPlay}
      fullWidth={true}
      onClick={playOrParse}
      color="secondary"
      size="large"
      loading={loadingAudio}
      sx={{ p: 2, borderRadius: 0, }}
    >
      {playIcon}
    </LoadingButton>
  );
}
