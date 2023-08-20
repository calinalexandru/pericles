// /* eslint-disable no-unused-vars */
import { values, } from 'ramda';
import { tap, } from 'rxjs/operators';

import Speech from '@/speech';
import { ERROR_CODES, PLAYER_STATUS, } from '@pericles/constants';
import {
  store,
  appActions,
  parserActions,
  parserEndSelector,
  parserIframesSelector,
  parserKeySelector,
  playerActions,
  playerKeySelector,
  playerStatusSelector,
  playerTabSelector,
} from '@pericles/store';
import {
  findAvailableIframe,
  isPlayingOrReady,
  mpToContent,
} from '@pericles/util';

const { player, } = playerActions;
const { highlight, autoscroll, credits, } = appActions;
const { parser, } = parserActions;

export default () => {
  console.log('initialize speech');
  Speech.stream$
    .pipe(
      tap((out) => {
        console.log('Speech.stream$.subscribe.out', out);
        const state = store.getState();
        const playingTab = playerTabSelector(state);
        const parserIframes = parserIframesSelector(state);
        const { event, params, } = out;
        const {
          wordList,
          charIndex,
          charLength,
          buffering,
          // index,
          // continueSpeaking = false,
          credits: creditsVal,
          code: errorCode,
        } = params || {};
        console.log('Speech.stream$.subscribe', { params, });
        const playerKey = playerKeySelector(state);
        switch (event) {
        // case 'onPause':
        //   console.log('onPause');
        //   store.dispatch(player.set({ status: PLAYER_STATUS.PAUSED }));
        //   break;
        // case 'onResume':
        //   console.log('onResume');
        //   store.dispatch(player.resumeEvent());
        //   break;
        case 'onStart':
          console.log('onStart', { playingTab, playerKey, });
          store.dispatch(
            player.set({
              status: PLAYER_STATUS.PLAYING,
            })
          );
          mpToContent(
            [ highlight.section(), autoscroll.set({ section: playerKey, }), ],
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
            store.dispatch(player.next({ auto: true, }));
          } else if (parserEndSelector(state)) {
            console.log('parserIframes', parserIframes);
            const availableIframeKey = findAvailableIframe(parserIframes);
            let newIframes = parserIframes;
            if (availableIframeKey) {
              newIframes = {
                ...parserIframes,
                ...{
                  [availableIframeKey]: {
                    ...parserIframes[availableIframeKey],
                    parsing: true,
                  },
                },
              };
            }
            console.log('onEnd.iframe', newIframes);
            console.log('going to next.iframe');
            store.dispatch(player.end({ iframes: newIframes, }));
          }
          break;
        case 'onBoundary':
          console.log('onBoundary', charIndex, charLength);
          mpToContent(highlight.word({ charIndex, charLength, }), playingTab);
          break;
        case 'onWordsUpdate':
          console.log('onWordsUpdate', wordList);
          mpToContent(parser.wordsUpdate({ wordList, }), playingTab);
          break;
        case 'onBuffering':
          // console.log('onBuffering', buffering);
          store.dispatch(player.set({ buffering, }));
          break;
        case 'onCreditsBurn':
          // console.log('onCreditsBurn', creditsVal);
          store.dispatch(credits.burn(creditsVal));
          break;
        case 'onError':
          console.log('onError');
          if (errorCode === ERROR_CODES.WEBSOCKET.THROTTLE) {
            store.dispatch(player.overload());
          } else if (values(ERROR_CODES.WEBSOCKET).includes(errorCode)) {
            store.dispatch(player.crash());
          } else if (errorCode === ERROR_CODES.PLAYER.TIMEOUT) {
            store.dispatch(player.timeout());
          } else if (errorCode === ERROR_CODES.PLAYER.TEXT_EXCEED) {
            store.dispatch(
              player.crash({ message: 'Your text is too big for me, senapi', })
            );
          } else {
            store.dispatch(player.crash());
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
