import { PayloadAction, getType, } from '@reduxjs/toolkit';
import { Action, } from 'redux';
import { Epic, ofType, } from 'redux-observable';
import { from, interval, of, } from 'rxjs';
import {
  concatMap,
  debounceTime,
  delay,
  filter,
  first,
  ignoreElements,
  map,
  mergeMap,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';

import Speech from '@/speech';
import {
  ATTRIBUTES,
  PARSER_TYPES,
  PLAYER_STATUS,
  ParserTypes,
  PlayerStatusTypes,
} from '@pericles/constants';
import {
  PlayPayloadType,
  RootState,
  appActions,
  appActiveTabSelector,
  appSelectedTextSelector,
  appSkipDeadSectionsSelector,
  combineAnyEpics,
  notificationActions,
  parserActions,
  parserIframesSelector,
  parserMaxPageSelector,
  parserPageSelector,
  parserTypeSelector,
  playerActions,
  playerStatusSelector,
  playerTabSelector,
} from '@pericles/store';
import {
  isGoogleBook,
  isIframeParsing,
  isPaused,
  isStopped,
  mpToContent,
} from '@pericles/util';

import { playOrRequest$, } from './handlers';

let healthCheckCounter = 0;
const HEALTH_CHECK_INTERVAL = 1000;
// TODO: Improve poor man's health check
const periodicHealthCheckEpic: Epic<PayloadAction, PayloadAction, RootState> = (
  action,
  state
) =>
  interval(HEALTH_CHECK_INTERVAL).pipe(
    mergeMap(() => {
      if (
        (
          [ PLAYER_STATUS.WAITING, PLAYER_STATUS.LOADING, ] as PlayerStatusTypes[]
        ).includes(playerStatusSelector(state.value))
      ) {
        healthCheckCounter++;
      } else {
        healthCheckCounter = 0;
      }
      return healthCheckCounter > 5
        ? from([ playerActions.stop(), appActions.routeError(), ])
        : of(playerActions.idle());
    })
  );

const proxyPlayEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.proxyPlay)),
    tap(() => {
      console.log('player.proxyPlay', action, state);
    }),
    pluck('payload'),
    map(playerActions.play)
  );

const proxyResetAndRequestPlayEpic: Epic<
  PayloadAction<PlayPayloadType>,
  never,
  RootState
> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.proxyResetAndRequestPlay)),
    pluck('payload'),
    tap((payload) => {
      console.log('proxyResetAndRequestPlayEpic', payload);
      mpToContent(
        [
          parserActions.reset({ revertHtml: false, }),
          playerActions.reset({ tab: appActiveTabSelector(state.value), }),
          playerActions.sectionsRequestAndPlay(payload),
        ],
        appActiveTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const proxySectionsRequestAndPlayEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.proxySectionsRequestAndPlay)),
    pluck('payload'),
    tap((payload) => {
      console.log('proxySectionsRequestAndPlayEpic - ', payload);
      mpToContent(
        playerActions.sectionsRequestAndPlay(payload),
        playerTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const playEpic: Epic<any> = (action$, state$) =>
  action$.pipe(
    ofType(getType(playerActions.play)),
    tap(() => console.log('player.play', action$, state$)),
    pluck('payload'),
    concatMap((payload: any = {}) => {
      const actions: Action<any>[] = [];
      const initialActions = [ playerActions.set({ buffering: true, }), ];

      const playOrRequestResponse = playOrRequest$(state$, payload, actions);
      const additionalActions = playOrRequestResponse
        ? [ playOrRequestResponse, ]
        : [ playerActions.idle(), ];

      return from([ ...initialActions, ...additionalActions, ]);
    })
  );

const timeoutEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(playerActions.timeout)),
    tap(() => {
      console.log('player has timed out');
    }),
    map(appActions.routeSkip)
  );

const pauseEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(playerActions.pause)),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const toggleEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.toggle)),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() =>
      isPaused(playerStatusSelector(state.value))
        ? playerActions.resume()
        : playerActions.pause()
    )
  );

const resumeEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.resume)),
    concatMap(() => {
      const playingTab = playerTabSelector(state.value);
      const activeTab = appActiveTabSelector(state.value);
      console.log('resumeEpic', { playingTab, activeTab, });
      if (activeTab !== -1 && playingTab !== 0 && playingTab !== activeTab) {
        console.log('play.epic.switched tab');
        return of(
          playerActions.stop(),
          notificationActions.warning(
            'Player was active in another tab, press start again to begin'
          )
        );
      }
      Speech.resume();
      return of(playerActions.idle());
    })
  );

const stopEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.stop)),
    tap(() => {
      console.log('player.stop');
      Speech.stop();
      const playerTab = playerTabSelector(state.value);
      mpToContent(
        [
          parserActions.reset({ revertHtml: true, }),
          appActions.autoscrollClear(),
        ],
        playerTab
      );
    }),
    ignoreElements()
  );

const haltEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(playerActions.halt)),
    tap(() => {
      Speech.stop();
    }),
    map(parserActions.reset)
  );

const softHaltEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(playerActions.softHalt),
    tap(() => {
      Speech.stop();
    }),
    ignoreElements()
  );

const waitEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(playerActions.wait)),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const nextEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.next)),
    pluck('payload'),
    filter(
      (payload: any = {}) =>
        (!isGoogleBook(parserTypeSelector(state.value)) || payload.auto) &&
        !isStopped(playerStatusSelector(state.value))
    ),
    tap((payload) => {
      console.log('player.next', payload);
      mpToContent(
        [ appActions.highlightClearWords(), appActions.highlightSection(), ],
        playerTabSelector(state.value)
      );
    }),
    concatMap((payload: any = {}) =>
      from([
        playerActions.wait(),
        payload.auto ? playerActions.nextAuto() : playerActions.nextSlow(),
      ])
    )
  );

const nextPageEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.next)),
    pluck('payload'),
    filter(
      (payload: any = {}) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ playerActions.stop(), playerActions.nextMove(), ]))
  );

const nextMoveEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.nextMove)),
    tap((payload) => {
      console.log('nextMoveEpic', payload);
      mpToContent(parserActions.nextPage(), playerTabSelector(state.value));
    }),
    switchMap(() =>
      action.pipe(ofType(getType(parserActions.pageMoveComplete)), first())
    ),
    delay(500),
    tap(() => {
      mpToContent(
        playerActions.sectionsRequestAndPlay({ userGenerated: true, }),
        playerTabSelector(state.value)
      );
    })
  );

const prevPageEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.prev)),
    pluck('payload'),
    filter(
      (payload: any = {}) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ playerActions.stop(), playerActions.prevMove(), ]))
  );

const prevMoveEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.prevMove)),
    tap((payload) => {
      console.log('prevMoveEpic', payload);
      mpToContent(parserActions.prevPage(), playerTabSelector(state.value));
    }),
    switchMap(() =>
      action.pipe(ofType(getType(parserActions.pageMoveComplete)), first())
    ),
    delay(500),
    tap(() => {
      mpToContent(
        playerActions.sectionsRequestAndPlay({ userGenerated: true, }),
        playerTabSelector(state.value)
      );
    })
  );

const softNextEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.softNext)),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(playerActions.next)
  );

const softPrevEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.softPrev)),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(playerActions.prev)
  );

const endIframeEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.end)),
    filter(() => {
      const someIframes = parserIframesSelector(state.value);
      return !Object.keys(someIframes).every((val) =>
        isIframeParsing(val, someIframes)
      );
    }),
    pluck('payload'),
    tap((payload: any = {}) => {
      console.log('endIframeEpic', payload);
      mpToContent(
        [
          playerActions.sectionsRequestAndPlay({
            ...payload,
            userGenerated: true,
          }),
        ],
        playerTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const endEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.end)),
    filter(
      () =>
        (
          [
            PARSER_TYPES.GOOGLE_DOC,
            PARSER_TYPES.GOOGLE_DOC_SVG,
          ] as ParserTypes[]
        ).includes(parserTypeSelector(state.value)) &&
        parserMaxPageSelector(state.value) > parserPageSelector(state.value)
    ),
    tap(() => {
      const nextPage = parserPageSelector(state.value) + 1;
      console.log('player.endEpic', { nextPage, });
      mpToContent(
        [
          parserActions.reset({ revertHtml: true, }),
          playerActions.reset({ tab: appActiveTabSelector(state.value), }),
          parserActions.set({
            type: parserTypeSelector(state.value),
            page: nextPage,
            maxPage: parserMaxPageSelector(state.value),
          }),
          parserActions.pageMove({ index: nextPage, }),
        ],
        playerTabSelector(state.value)
      );
    }),
    switchMap(() =>
      action.pipe(ofType(getType(parserActions.pageMoveComplete)), first())
    ),
    delay(500),
    concatMap(() =>
      of(playerActions.play({ userGenerated: false, fromCursor: false, }))
    )
  );

const endPageEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.end)),
    filter(() => isGoogleBook(parserTypeSelector(state.value))),
    concatMap(() => from([ playerActions.stop(), playerActions.nextMove(), ]))
  );

const nextAutoEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(playerActions.nextAuto)),
    tap(() => {
      console.log('player.nextAuto');
    }),
    map(playerActions.play)
  );

const nextEpicThrottled: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(playerActions.nextSlow)),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.nextSlow');
    }),
    map(playerActions.play)
  );

const demandPlayEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.demand)),
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

const prevEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.prev)),
    pluck('payload'),
    filter(
      (payload: any = {}) =>
        (!isGoogleBook(parserTypeSelector(state.value)) || payload?.auto) &&
        !isStopped(playerStatusSelector(state.value))
    ),
    tap(() => {
      console.log('player.prev');
      mpToContent(
        [ appActions.highlightClearWords(), appActions.highlightSection(), ],
        playerTabSelector(state.value)
      );
    }),
    concatMap(() => of(playerActions.wait(), playerActions.prevSlow()))
  );

const prevEpicThrottled: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(playerActions.prevSlow)),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.prev');
    }),
    map(playerActions.play)
  );

const crashEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.crash)),
    tap(() => {
      console.log('player.crash');
    }),
    pluck('payload', 'message'),
    concatMap((text) =>
      appSkipDeadSectionsSelector(state.value)
        ? of(appActions.routeIndex(), playerActions.next({ auto: false, }))
        : of(notificationActions.warning(text), appActions.routeSkip())
    )
  );

export default combineAnyEpics(
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
  toggleEpic,
  softNextEpic,
  softPrevEpic,
  proxyResetAndRequestPlayEpic,
  proxySectionsRequestAndPlayEpic,
  periodicHealthCheckEpic
);
