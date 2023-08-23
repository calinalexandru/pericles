import { pathOr, } from 'ramda';
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
  appActiveTabSelector,
  appSelectedTextSelector,
  appSkipDeadSectionsSelector,
  autoscrollClear,
  highlightClearWords,
  highlightSection,
  nextPage,
  notificationWarning,
  pageMove,
  parserEndSelector,
  parserIframesSelector,
  parserMaxPageSelector,
  parserPageSelector,
  parserTypeSelector,
  playerCrash,
  playerHealthCheck,
  playerIdle,
  playerKeySelector,
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
  playerSectionsSelector,
  playerStatusSelector,
  playerStop,
  playerTabSelector,
  playerWait,
  prevPage,
  resetParser,
  routeError,
  routeIndex,
  routeSkip,
  sectionsRequestAndPlay,
  setParser,
  setPlayer,
} from '@pericles/store';
import {
  hasSectionsInAdvance,
  isError,
  isGoogleBook,
  isGoogleDocsSvg,
  isIframeParsing,
  isPaused,
  isPlaying,
  isStopped,
  mpToContent,
} from '@pericles/util';

const playOrRequest = (state, payload, actions) => {
  console.log('play.epic', state, payload);

  const userGenerated = pathOr(false, [ 'userGenerated', ], payload);
  const seek = pathOr(0, [ 'seek', ], payload);
  const playerKeyPayload = Number(pathOr(-1, [ 'key', ], payload));
  const playerSections = playerSectionsSelector(state.value);
  const playerKey =
    playerKeyPayload !== -1 ? playerKeyPayload : playerKeySelector(state.value);
  const playingTab = playerTabSelector(state.value);
  const activeTab = appActiveTabSelector(state.value);
  console.log('play.epic debug', {
    actions,
    playerSections,
    playerKey,
    playerKeyPayload,
    seek,
    userGenerated,
    playingTab,
    activeTab,
  });
  if (
    (userGenerated && playingTab !== activeTab) ||
    (!playerSections.length && isGoogleDocsSvg(parserTypeSelector(state.value)))
  ) {
    Speech.stop();
    console.log('playOrRequest.userGenerated.requestAndPlay', {
      userGenerated,
      playingTab,
      activeTab,
      playerSections,
    });
    mpToContent(
      [
        resetParser(),
        playerReset({ tab: activeTab, }),
        sectionsRequestAndPlay(payload),
      ],
      activeTab
    );
  } else if (
    playingTab !== 0 &&
    !parserEndSelector(state.value) &&
    !hasSectionsInAdvance(playerSections, playerKey)
  ) {
    Speech.stop();
    console.log(
      'playOrRequest.!hasSectionsInAdvance.requestAndPlay',
      playerSections,
      playerKey
    );

    mpToContent([ sectionsRequestAndPlay(payload), ], playingTab);
  } else if (actions.length === 0) {
    Speech.stop();
    console.log(
      'playOrRequest.playing - key, seek',
      seek,
      playerKey,
      playerSections
    );
    try {
      // const a = new SpeechSynthesisUtterance('Firefox is broken');
      // const b = new SpeechSynthesisUtterance('Broken inside its crazy');
      // speechSynthesis.speak(a)
      // a.onend = () => {
      //   speechSynthesis.speak(b)
      // }
      // const voice = settingsVoiceSelector(state.value);
      // if (!Speech.validate(voice)) Speech.setVoice(voice);
      Speech.play(playerSections[playerKey].text, seek);
    } catch (e) {
      console.error('Player has crashed, rip', e);
      return playerCrash();
    }
  } else {
    console.log('Speech is switching to free, do nothing');
  }
  return false;
};

const healthCheckEpic = (action) =>
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

const proxyPlayEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.PROXY_PLAY),
    tap(() => {
      console.log('player.proxyPlay', action, state);
    }),
    pluck('payload'),
    map(playerPlay)
  );

const playEpic = (action, state) =>
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
          // ...(appActiveTabSelector(state) !== -1 && {
          // tab: appActiveTabSelector(state),
          // }),
          // tab: 1879991899,
        }),
      ];
      if (userGenerated) out.push(playerHealthCheck());
      console.log('checkAuth.out', out, actions);
      if (!actions.length) {
        const playOrRequestResponse = playOrRequest(state, payload, actions);
        if (playOrRequestResponse) out.push(playOrRequestResponse);
        out.push(playerIdle());
        console.log('checkAuth.out.playOrReq', out);
      }
      return from(out);
      // console.log('notification.clear');
    })
  );

const timeoutEpic = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.TIMEOUT),
    tap(() => {
      console.log('player has timed out');
    }),
    map(routeSkip)
  );

const pauseEpic = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.PAUSE),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const toggleEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.TOGGLE),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() =>
      isPaused(playerStatusSelector(state.value))
        ? playerResume()
        : playerPause()
    )
  );

const resumeEpic = (action, state) =>
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

const stopEpic = (action, state) =>
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

const haltEpic = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.HALT),
    tap(() => {
      Speech.stop();
    }),
    map(resetParser)
  );

const softHaltEpic = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.SOFT_HALT),
    tap(() => {
      Speech.stop();
    }),
    ignoreElements()
  );

const waitEpic = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.WAIT),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const nextEpic = (action, state) =>
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

const nextPageEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.NEXT),
    pluck('payload'),
    filter(
      (payload = {}) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ playerStop(), playerNextMove(), ]))
  );

const nextMoveEpic = (action, state) =>
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
        sectionsRequestAndPlay({ userGenerated: true, }),
        playerTabSelector(state.value)
      );
    })
  );

const prevPageEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.PREV),
    pluck('payload'),
    filter(
      (payload = {}) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ playerStop(), playerPrevMove(), ]))
  );

const prevMoveEpic = (action, state) =>
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
        sectionsRequestAndPlay({ userGenerated: true, }),
        playerTabSelector(state.value)
      );
    })
  );

const softNextEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.SOFT_NEXT),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(playerNext)
  );

const softPrevEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.SOFT_PREV),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(playerPrev)
  );

const endIframeEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.END),
    filter(() => {
      const someIframes = parserIframesSelector(state.value);
      return !Object.values(someIframes).every((val) => isIframeParsing(val));
    }),
    pluck('payload'),
    tap((payload) => {
      console.log('endIframeEpic', payload);
      mpToContent(
        [ sectionsRequestAndPlay({ ...payload, userGenerated: true, }), ],
        playerTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const endEpic = (action, state) =>
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

const endPageEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.END),
    filter(() => isGoogleBook(parserTypeSelector(state.value))),
    concatMap(() => from([ playerStop(), playerNextMove(), ]))
  );

const nextAutoEpic = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.NEXT_AUTO),
    tap(() => {
      console.log('player.nextAuto');
    }),
    map(playerPlay)
  );

const nextEpicThrottled = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.NEXT_SLOW),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.nextSlow');
    }),
    map(playerPlay)
  );

const demandPlayEpic = (action, state) =>
  action.pipe(
    ofType(PlayerActionTypes.DEMAND),
    tap(() => {
      console.log('player.demand');
      try {
        Speech.play(appSelectedTextSelector(state.value), 0, true);
      } catch (e) {
        console.error('Please enter text', e);
      }
    }),
    ignoreElements()
  );

const prevEpic = (action, state) =>
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

const prevEpicThrottled = (action) =>
  action.pipe(
    ofType(PlayerActionTypes.PREV_SLOW),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.prev');
    }),
    map(playerPlay)
  );

const crashEpic = (action, state) =>
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
  softPrevEpic
);
