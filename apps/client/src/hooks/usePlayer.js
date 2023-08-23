import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import {
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
    (params) => {
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
    dispatch(playerNext());
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
