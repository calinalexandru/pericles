import { getType, } from '@reduxjs/toolkit';
import { combineEpics, ofType, } from 'redux-observable';
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
  AllActions,
  EpicFunction,
  appActions,
  appActiveTabSelector,
  appSelectedTextSelector,
  appSkipDeadSectionsSelector,
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
const periodicHealthCheckEpic: EpicFunction = (action, state) =>
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

const proxyPlayEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.proxyPlay)),
    tap(() => {
      console.log('player.proxyPlay', action, state);
    }),
    map((act) => act.payload),
    map((payload) => playerActions.play(payload))
  );

const proxyResetAndRequestPlayEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.proxyResetAndRequestPlay)),
    map((act) => act.payload),
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

const proxySectionsRequestAndPlayEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.proxySectionsRequestAndPlay)),
    map((act) => act.payload),
    tap((payload) => {
      console.log('proxySectionsRequestAndPlayEpic - ', payload);
      mpToContent(
        playerActions.sectionsRequestAndPlay(payload),
        playerTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const playEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.play)),
    tap(() => console.log('player.play', action, state)),
    pluck('payload'),
    concatMap((payload) => {
      const actions: AllActions[] = [];
      const initialActions = [ playerActions.set({ buffering: true, }), ];

      const playOrRequestResponse = playOrRequest$(state, payload, actions);
      const additionalActions = playOrRequestResponse
        ? [ playOrRequestResponse, ]
        : [ playerActions.idle(), ];

      return from([ ...initialActions, ...additionalActions, ]);
    })
  );

const timeoutEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(playerActions.timeout)),
    tap(() => {
      console.log('player has timed out');
    }),
    map(() => appActions.routeSkip())
  );

const pauseEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(playerActions.pause)),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const toggleEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.toggle)),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() =>
      isPaused(playerStatusSelector(state.value))
        ? playerActions.resume()
        : playerActions.pause()
    )
  );

const resumeEpic: EpicFunction = (action, state) =>
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

const stopEpic: EpicFunction = (action, state) =>
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

const haltEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(playerActions.halt)),
    tap(() => {
      Speech.stop();
    }),
    map(() => parserActions.reset({ revertHtml: false, }))
  );

const softHaltEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(playerActions.softHalt)),
    tap(() => {
      Speech.stop();
    }),
    ignoreElements()
  );

const waitEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(playerActions.wait)),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const nextEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.next)),
    pluck('payload'),
    filter(
      (payload) =>
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
    concatMap((payload) =>
      from([
        playerActions.wait(),
        payload.auto ? playerActions.nextAuto() : playerActions.nextSlow(),
      ])
    )
  );

const nextPageEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.next)),
    pluck('payload'),
    filter(
      (payload) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ playerActions.stop(), playerActions.nextMove(), ]))
  );

const nextMoveEpic: EpicFunction = (action, state) =>
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
    }),
    ignoreElements()
  );

const prevPageEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.prev)),
    pluck('payload'),
    filter(
      (payload) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ playerActions.stop(), playerActions.prevMove(), ]))
  );

const prevMoveEpic: EpicFunction = (action, state) =>
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

const softNextEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.softNext)),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() => playerActions.next({ auto: false, }))
  );

const softPrevEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.softPrev)),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() => playerActions.prev({ auto: false, }))
  );

const endIframeEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.end)),
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

const endEpic: EpicFunction = (action, state) =>
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

const endPageEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.end)),
    filter(() => isGoogleBook(parserTypeSelector(state.value))),
    concatMap(() => from([ playerActions.stop(), playerActions.nextMove(), ]))
  );

const nextAutoEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(playerActions.nextAuto)),
    tap(() => {
      console.log('player.nextAuto');
    }),
    map(() => playerActions.play({ userGenerated: false, }))
  );

const nextEpicThrottled: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(playerActions.nextSlow)),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.nextSlow');
    }),
    map(() => playerActions.play({ userGenerated: false, }))
  );

const demandPlayEpic: EpicFunction = (action, state) =>
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

const prevEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.prev)),
    pluck('payload'),
    filter(
      (payload) =>
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

const prevEpicThrottled: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(playerActions.prevSlow)),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.prev');
    }),
    map(() => playerActions.play({ userGenerated: false, }))
  );

const crashEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(playerActions.crash)),
    map((act) => act.payload),
    concatMap((text) =>
      appSkipDeadSectionsSelector(state.value)
        ? of(appActions.routeIndex(), playerActions.next({ auto: false, }))
        : of(notificationActions.warning(text), appActions.routeSkip())
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
  toggleEpic,
  softNextEpic,
  softPrevEpic,
  proxyResetAndRequestPlayEpic,
  proxySectionsRequestAndPlayEpic,
  periodicHealthCheckEpic
);
