import { tap, } from 'rxjs/operators';

import Speech from '@/speech';
import { PLAYER_STATUS, } from '@pericles/constants';
import {
  store,
  parserEndSelector,
  parserIframesSelector,
  parserKeySelector,
  playerKeySelector,
  playerStatusSelector,
  playerTabSelector,
  highlightSection,
  autoscrollSet,
  highlightWord,
  setPlayer,
  playerNext,
  playerCrash,
  playerEnd,
} from '@pericles/store';
import {
  findAvailableIframe,
  isPlayingOrReady,
  mpToContent,
} from '@pericles/util';

export default (): void => {
  console.log('initialize speech');
  Speech.stream$
    .pipe(
      tap((out) => {
        console.log('Speech.stream$.subscribe.out', out);
        const state = store.getState();
        if (state === null) return;
        const playingTab = playerTabSelector(state);
        const parserIframes = parserIframesSelector(state);
        const { event, params, } = out;
        const {
          charIndex,
          errorMessage,
          // index,
        } = params || {};
        console.log('Speech.stream$.subscribe', { params, });
        const playerKey = playerKeySelector(state);
        switch (event) {
        case 'onStart':
          console.log('onStart', { playingTab, playerKey, });
          store.dispatch(
            setPlayer({
              status: PLAYER_STATUS.PLAYING,
              buffering: false,
            })
          );
          mpToContent(
            [ highlightSection(), autoscrollSet({ section: playerKey, }), ],
            playingTab
          );
          break;
        case 'onEnd':
          console.log('onEnd', state);
          if (
            isPlayingOrReady(playerStatusSelector(state)) &&
              parserKeySelector(state) - 1 > playerKey
          ) {
            console.log('going to next', {
              playerStatus: playerStatusSelector(state),
            });
            store.dispatch(playerNext({ auto: true, }));
          } else if (parserEndSelector(state)) {
            console.log('parserIframes', parserIframes);
            const availableIframeKey = findAvailableIframe(parserIframes);
            let newIframes = parserIframes;
            if (availableIframeKey) {
              newIframes = {
                ...parserIframes,
                ...{
                  [availableIframeKey as string]: {
                    ...parserIframes[availableIframeKey as string],
                    parsing: true,
                  },
                },
              };
            }
            console.log('onEnd.iframe', newIframes);
            console.log('going to next.iframe');
            store.dispatch(playerEnd({ iframes: newIframes, }));
          }
          break;
        case 'onBoundary':
          console.log('onBoundary', charIndex, length);
          mpToContent(
            highlightWord({ charIndex, charLength: length, }),
            playingTab
          );
          break;
        case 'onError':
          console.log('onError');
          if (errorMessage) {
            store.dispatch(playerCrash({ message: errorMessage, }));
          } else {
            store.dispatch(playerCrash({ message: 'generic player crash', }));
          }
          break;
        default:
        }
      })
    )
    .subscribe((out) => {
      console.log('stream.subscribe', out);
    });
};
