import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import {
  PlayerPlayParams,
  playerNext,
  playerPause,
  playerPlay,
  playerPrev,
  playerResume,
  playerStop,
} from '@pericles/store';

export default function usePlayer() {
  const dispatch = useDispatch();

  const play = useCallback(
    (params: PlayerPlayParams) => {
      dispatch(playerPlay(params));
    },
    [ dispatch, ]
  );

  const stop = useCallback(() => {
    dispatch(playerStop());
  }, [ dispatch, ]);

  const pause = useCallback(() => {
    dispatch(playerPause());
  }, [ dispatch, ]);

  const resume = useCallback(() => {
    dispatch(playerResume());
  }, [ dispatch, ]);

  const next = useCallback(() => {
    dispatch(playerNext({ auto: false, }));
  }, [ dispatch, ]);

  const prev = useCallback(() => {
    dispatch(playerPrev());
  }, [ dispatch, ]);

  return {
    play,
    pause,
    resume,
    stop,
    next,
    prev,
  };
}
