import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { playerActions, } from '@pericles/store';

const { player, } = playerActions;
export default function usePlayer() {
  const dispatch = useDispatch();

  const play = useCallback((params) => {
    dispatch(player.play(params));
  }, []);

  const stop = useCallback(() => {
    dispatch(player.stop());
  }, []);

  const pause = useCallback(() => {
    dispatch(player.pause());
  }, []);

  const resume = useCallback(() => {
    dispatch(player.resume());
  }, []);

  const next = useCallback(() => {
    dispatch(player.next());
  }, []);

  const prev = useCallback(() => {
    dispatch(player.prev());
  }, []);

  return {
    play,
    pause,
    resume,
    stop,
    next,
    prev,
  };
}
