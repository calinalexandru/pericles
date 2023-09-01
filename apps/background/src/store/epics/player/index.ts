import { pathOr, } from 'ramda';
import { Action, } from 'redux-actions';
import { combineEpics, ofType, } from 'redux-observable';
import { from, of, } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  delay,
  filter,
  first,
  ignoreElements,
  map,
  pluck,
  switchMap,
  tap,
  timeout,
} from 'rxjs/operators';

import Speech from '@/speech';
import { ATTRIBUTES, PARSER_TYPES, VARIABLES, } from '@pericles/constants';
import {
  PageActionTypes,
  PlayerActionTypes,
  PlayerState,
  appActiveTabSelector,
  appSelectedTextSelector,
  appSkipDeadSectionsSelector,
  autoscrollClear,
  highlightClearWords,
  highlightSection,
  nextPage,
  notificationWarning,
  pageMove,
  parserIframesSelector,
  parserMaxPageSelector,
  parserPageSelector,
  parserTypeSelector,
  playerHealthCheck,
  playerIdle,
  playerNext,
  playerNextAuto,
  playerNextMove,
  playerNextSlow,
  playerPause,
  playerPlay,
  playerPrev,
  playerPrevMove,
  playerPrevSlow,
  playerReset,
  playerResume,
  playerStatusSelector,
  playerStop,
  playerTabSelector,
  playerWait,
  prevPage,
  proxyResetAndRequestPlay,
  proxySectionsRequestAndPlay,
  resetParser,
  routeError,
  routeIndex,
  routeSkip,
  sectionsRequestAndPlay,
  setParser,
  setPlayer,
} from '@pericles/store';
import {
  isError,
  isGoogleBook,
  isIframeParsing,
  isPaused,
  isPlaying,
  isStopped,
  mpToContent,
} from '@pericles/util';

import { playOrRequest$, } from './handlers';

type PlayerAction = Action<PlayerActionTypes, Partial<PlayerState>>;

// const HEALTH_CHECK_INTERVAL = 1000;
// const periodicHealthCheckEpic: Epic<PlayerAction> = (action, state) =>
//   interval(HEALTH_CHECK_INTERVAL).pipe(
//     mergeMap(() => {
//       console.log('checking the boy health')
//       if (!isStopped(playerStatusSelector(state.value))) {
//         console.log('dispatching medicine')
//         return of(playerHealthCheck());
//       }
//       return of(playerIdle());
//     })
//   );

const healthCheckEpic: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.HEALTH_CHECK),
    switchMap(() =>
      action.pipe(
        ofType(PlayerActionTypes.SET, PlayerActionTypes.ERROR),
        first(),
        pluck('payload', VARIABLES.PLAYER.STATUS),
        filter((status) => isPlaying(status) || isError(status)),
        timeout(ATTRIBUTES.MISC.PLAY_TIMEOUT),
        catchError(() => of('timeout'))
      )
    ),
    map((result) => (result === 'timeout' ? routeError() : playerIdle()))
  );

const proxyPlayEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.PROXY_PLAY),
    tap(() => {
      console.log('player.proxyPlay', action, state);
    }),
    pluck('payload'),
    map(playerPlay)
  );

const proxyResetAndRequestPlayEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(proxyResetAndRequestPlay.request),
    pluck('payload'),
    tap((payload) => {
      console.log('proxyResetAndRequestPlayEpic');
      mpToContent(
        [
          resetParser(),
          playerReset({ tab: appActiveTabSelector(state.value), }),
          sectionsRequestAndPlay.request(payload),
        ],
        appActiveTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const proxySectionsRequestAndPlayEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(proxySectionsRequestAndPlay.request),
    pluck('payload'),
    tap((payload) => {
      console.log('proxySectionsRequestAndPlayEpic - ', payload);
      mpToContent(
        sectionsRequestAndPlay.request(payload),
        playerTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const playEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.PLAY),
    tap(() => {
      console.log('player.play', action, state);
    }),
    pluck('payload'),
    concatMap((payload) => {
      console.log('checkAuth', { ...state.value, }, { ...payload, });
      const userGenerated = pathOr(false, [ 'userGenerated', ], payload);
      // let text;
      const actions = [];

      const out = [
        ...actions,
        setPlayer({
          buffering: true,
        }),
      ];

      if (userGenerated) out.push(playerHealthCheck());
      console.log('checkAuth.out', out, actions);
      if (!actions.length) {
        const playOrRequestResponse = playOrRequest$(state, payload, actions);
        if (playOrRequestResponse) out.push(playOrRequestResponse);
        out.push(playerIdle());
        console.log('checkAuth.out.playOrReq', out);
      }
      return from(out);
      // console.log('notification.clear');
    })
  );

const timeoutEpic: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.TIMEOUT),
    tap(() => {
      console.log('player has timed out');
    }),
    map(routeSkip)
  );

const pauseEpic: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.PAUSE),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const toggleEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.TOGGLE),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() =>
      isPaused(playerStatusSelector(state.value))
        ? playerResume()
        : playerPause()
    )
  );

const resumeEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.RESUME),
    concatMap(() => {
      const playingTab = playerTabSelector(state.value);
      const activeTab = appActiveTabSelector(state.value);
      console.log('resumeEpic', { playingTab, activeTab, });
      if (activeTab !== -1 && playingTab !== 0 && playingTab !== activeTab) {
        console.log('play.epic.switched tab');
        return of(
          playerStop(),
          notificationWarning({
            text: 'Player was active in another tab, press start again to begin',
          })
        );
      }
      Speech.resume();
      return of(playerIdle());
    })
  );

const stopEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.STOP),
    tap(() => {
      console.log('player.stop');
      Speech.stop();
      const playerTab = playerTabSelector(state.value);
      mpToContent(
        [ resetParser({ revertHtml: true, }), autoscrollClear(), ],
        playerTab
      );
    }),
    ignoreElements()
  );

const haltEpic: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.HALT),
    tap(() => {
      Speech.stop();
    }),
    map(resetParser)
  );

const softHaltEpic: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.SOFT_HALT),
    tap(() => {
      Speech.stop();
    }),
    ignoreElements()
  );

const waitEpic: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.WAIT),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const nextEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.NEXT),
    pluck('payload'),
    filter(
      (payload = {}) =>
        (!isGoogleBook(parserTypeSelector(state.value)) || payload.auto) &&
        !isStopped(playerStatusSelector(state.value))
    ),
    tap((payload) => {
      console.log('player.next', payload);
      mpToContent(
        [ highlightClearWords(), highlightSection(), ],
        playerTabSelector(state.value)
      );
    }),
    concatMap((payload = {}) =>
      from([ playerWait(), payload.auto ? playerNextAuto() : playerNextSlow(), ])
    )
  );

const nextPageEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.NEXT),
    pluck('payload'),
    filter(
      (payload = {}) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ playerStop(), playerNextMove(), ]))
  );

const nextMoveEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.NEXT_MOVE),
    tap((payload) => {
      console.log('nextMoveEpic', payload);
      mpToContent(nextPage(), playerTabSelector(state.value));
    }),
    switchMap(() =>
      action.pipe(ofType(PageActionTypes.MOVE_COMPLETE), first())
    ),
    delay(500),
    tap(() => {
      mpToContent(
        sectionsRequestAndPlay.request({ userGenerated: true, }),
        playerTabSelector(state.value)
      );
    })
  );

const prevPageEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.PREV),
    pluck('payload'),
    filter(
      (payload = {}) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ playerStop(), playerPrevMove(), ]))
  );

const prevMoveEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.PREV_MOVE),
    tap((payload) => {
      console.log('prevMoveEpic', payload);
      mpToContent(prevPage(), playerTabSelector(state.value));
    }),
    switchMap(() =>
      action.pipe(ofType(PageActionTypes.MOVE_COMPLETE), first())
    ),
    delay(500),
    tap(() => {
      mpToContent(
        sectionsRequestAndPlay.request({ userGenerated: true, }),
        playerTabSelector(state.value)
      );
    })
  );

const softNextEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.SOFT_NEXT),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(playerNext)
  );

const softPrevEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.SOFT_PREV),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(playerPrev)
  );

const endIframeEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.END),
    filter(() => {
      const someIframes = parserIframesSelector(state.value);
      return !Object.keys(someIframes).every((val) =>
        isIframeParsing(val, someIframes)
      );
    }),
    pluck('payload'),
    tap((payload) => {
      console.log('endIframeEpic', payload);
      mpToContent(
        [ sectionsRequestAndPlay.request({ ...payload, userGenerated: true, }), ],
        playerTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const endEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.END),
    filter(
      () =>
        [ PARSER_TYPES.GOOGLE_DOC, PARSER_TYPES.GOOGLE_DOC_SVG, ].includes(
          parserTypeSelector(state.value)
        ) &&
        parserMaxPageSelector(state.value) > parserPageSelector(state.value)
    ),
    tap(() => {
      const nextPage = parserPageSelector(state.value) + 1;
      console.log('player.endEpic', { nextPage, });
      mpToContent(
        [
          resetParser({ revertHtml: true, }),
          playerReset({ tab: appActiveTabSelector(state), }),
          setParser({
            type: parserTypeSelector(state.value),
            page: nextPage,
            maxPage: parserMaxPageSelector(state.value),
          }),
          pageMove({ index: nextPage, }),
        ],
        playerTabSelector(state.value)
      );
    }),
    switchMap(() =>
      action.pipe(ofType(PageActionTypes.MOVE_COMPLETE), first())
    ),
    delay(500),
    concatMap(() => of(playerPlay()))
  );

const endPageEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.END),
    filter(() => isGoogleBook(parserTypeSelector(state.value))),
    concatMap(() => from([ playerStop(), playerNextMove(), ]))
  );

const nextAutoEpic: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.NEXT_AUTO),
    tap(() => {
      console.log('player.nextAuto');
    }),
    map(playerPlay)
  );

const nextEpicThrottled: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.NEXT_SLOW),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.nextSlow');
    }),
    map(playerPlay)
  );

const demandPlayEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.DEMAND),
    tap(() => {
      console.log('player.demand');
      try {
        Speech.play(appSelectedTextSelector(state.value));
      } catch (e) {
        console.error('Please enter text', e);
      }
    }),
    ignoreElements()
  );

const prevEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.PREV),
    pluck('payload'),
    filter(
      (payload = {}) =>
        (!isGoogleBook(parserTypeSelector(state.value)) || payload.auto) &&
        !isStopped(playerStatusSelector(state.value))
    ),
    tap(() => {
      console.log('player.prev');
      mpToContent(
        [ highlightClearWords(), highlightSection(), ],
        playerTabSelector(state.value)
      );
    }),
    concatMap(() => of(playerWait(), playerPrevSlow()))
  );

const prevEpicThrottled: Epic<PlayerAction> = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.PREV_SLOW),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.prev');
    }),
    map(playerPlay)
  );

const crashEpic: Epic<PlayerAction> = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.CRASH),
    tap(() => {
      console.log('player.crash');
    }),
    pluck('payload', 'message'),
    concatMap((text) =>
      appSkipDeadSectionsSelector(state.value)
        ? of(routeIndex(), playerNext())
        : of(notificationWarning({ text, }), routeSkip())
    )
  );

export default combineEpics(
  proxyPlayEpic,
  endIframeEpic,
  nextMoveEpic,
  prevMoveEpic,
  endPageEpic,
  prevPageEpic,
  nextPageEpic,
  playEpic,
  pauseEpic,
  stopEpic,
  resumeEpic,
  nextEpic,
  demandPlayEpic,
  waitEpic,
  nextAutoEpic,
  nextEpicThrottled,
  prevEpic,
  prevEpicThrottled,
  crashEpic,
  haltEpic,
  softHaltEpic,
  endEpic,
  timeoutEpic,
  healthCheckEpic,
  toggleEpic,
  softNextEpic,
  softPrevEpic,
  proxyResetAndRequestPlayEpic,
  proxySectionsRequestAndPlayEpic
);
