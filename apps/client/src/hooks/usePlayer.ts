import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { PlayerPlayParams, playerActions, } from '@pericles/store';

export default function usePlayer() {
  const dispatch = useDispatch();

  const play = useCallback(
    (params: PlayerPlayParams) => {
      dispatch(playerActions.play(params));
    },
    [ dispatch, ]
  );

  const stop = useCallback(() => {
    dispatch(playerActions.stop());
  }, [ dispatch, ]);

  const pause = useCallback(() => {
    dispatch(playerActions.pause());
  }, [ dispatch, ]);

  const resume = useCallback(() => {
    dispatch(playerActions.resume());
  }, [ dispatch, ]);

  const next = useCallback(() => {
    dispatch(playerActions.next({ auto: false, }));
  }, [ dispatch, ]);

  const prev = useCallback(() => {
    dispatch(playerActions.prev());
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
