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
  appActions,
  appActiveTabSelector,
  appSelectedTextSelector,
  appSkipDeadSectionsSelector,
  notificationActions,
  parserActions,
  parserEndSelector,
  parserIframesSelector,
  parserMaxPageSelector,
  parserPageSelector,
  parserTypeSelector,
  playerActions,
  playerKeySelector,
  playerSectionsSelector,
  playerStatusSelector,
  playerTabSelector,
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

// TODO:: improve this line
/* eslint-disable-next-line */
// const junk = new Speech();
// let junk;

const { player, sections, } = playerActions;
const { parser, page, } = parserActions;
const { notification, } = notificationActions;
const { autoscroll, route, highlight, } = appActions;

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
    console.log('playOrRequest.userGenerated.requestAndPlay');
    mpToContent(
      [ parser.reset(), player.reset(), sections.requestAndPlay(payload), ],
      activeTab
    );
  } else if (
    playingTab !== 0 &&
    !parserEndSelector(state.value) &&
    !hasSectionsInAdvance(playerSections, playerKey)
  ) {
    Speech.stop();
    console.log('playOrRequest.!hasSectionsInAdvance.requestAndPlay');

    mpToContent([ sections.requestAndPlay(payload), ], playingTab);
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
      return player.crash();
    }
  } else {
    console.log('Speech is switching to free, do nothing');
  }
  return false;
};

const healthCheckEpic = (action) =>
  action.pipe(
    ofType(player.healthCheck),
    switchMap(() =>
      action.pipe(
        ofType(player.set, player.error),
        first(),
        pluck('payload', VARIABLES.PLAYER.STATUS),
        filter((status) => isPlaying(status) || isError(status)),
        timeout(ATTRIBUTES.MISC.PLAY_TIMEOUT),
        catchError(() => of('timeout'))
      )
    ),
    map((result) => (result === 'timeout' ? route.error() : player.wank()))
  );

const proxyPlayEpic = (action, state) =>
  action.pipe(
    ofType(player.proxyPlay),
    tap(() => {
      console.log('player.proxyPlay', action, state);
    }),
    pluck('payload'),
    map((payload) => player.play(payload))
  );

const playEpic = (action, state) =>
  action.pipe(
    ofType(player.play),
    tap(() => {
      console.log('player.play', action, state);
    }),
    pluck('payload'),
    concatMap((payload) => {
      console.log('checkAuth', { ...state.value, }, { ...payload, });
      const userGenerated = pathOr(false, [ 'userGenerated', ], payload);
      // let text;
      const actions = [];

      const out = [ ...actions, player.set({ buffering: true, }), ];
      if (userGenerated) out.push(player.healthCheck());
      console.log('checkAuth.out', out, actions);
      if (!actions.length) {
        const playOrRequestResponse = playOrRequest(state, payload, actions);
        if (playOrRequestResponse) out.push(playOrRequestResponse);
        out.push(player.wank());
        console.log('checkAuth.out.playOrReq', out);
      }
      return from(out);
      // console.log('notification.clear');
    })
  );

const timeoutEpic = (action) =>
  action.pipe(
    ofType(player.timeout),
    tap(() => {
      console.log('player has timed out');
    }),
    map(() => route.skip())
  );

const pauseEpic = (action) =>
  action.pipe(
    ofType(player.pause),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const seekEpic = (action) =>
  action.pipe(
    ofType(player.seek),
    pluck('payload'),
    tap((time) => {
      console.log('seekEpic.time', time);
      Speech.seek(Number(time || 0));
    }),
    ignoreElements()
  );

const toggleEpic = (action, state) =>
  action.pipe(
    ofType(player.toggle),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() =>
      isPaused(playerStatusSelector(state.value))
        ? player.resume()
        : player.pause()
    )
  );

// const resumeEventEpic = (action, state) =>
//   action.pipe(
//     ofType(player.resumeEvent),
//     filter(() => !isPlaying(playerStatusSelector(state.value))),
//     switchMap(() =>
//       action.pipe(
//         ofType(player.set),
//         pluck('payload'),
//         filter((payload) => isPlaying(playerStatusSelector(payload))),
//         timeout(3000),
//         catchError(() => of({ timeout: true }))
//       )
//     ),
//     tap((out) => {
//       console.log('resumeEventEpic', out);
//     }),
//     concatMap((response = {}) =>
//       of(response.timeout ? player.continue() : player.wank())
//     )
//   );

// const continueEpic = (action) =>
//   action.pipe(
//     ofType(player.continue),
//     tap(() => {
//       console.log('player.continue');
//       Speech.continue();
//     }),
//     ignoreElements()
//   );

const resumeEpic = (action, state) =>
  action.pipe(
    ofType(player.resume),
    concatMap(() => {
      const playingTab = playerTabSelector(state.value);
      const activeTab = appActiveTabSelector(state.value);
      console.log('resumeEpic', { playingTab, activeTab, });
      if (activeTab !== -1 && playingTab !== 0 && playingTab !== activeTab) {
        console.log('play.epic.switched tab');
        return of(
          player.stop(),
          notification.warning({
            text: 'Player was active in another tab, press start again to begin',
          })
        );
      }
      Speech.resume();
      return of(player.wank());
    })
  );

const stopEpic = (action, state) =>
  action.pipe(
    ofType(player.stop),
    tap(() => {
      console.log('player.stop');
      Speech.stop();
      const playerTab = playerTabSelector(state.value);
      mpToContent(
        [ parser.reset({ revertHtml: true, }), autoscroll.clear(), ],
        playerTab
      );
    }),
    ignoreElements()
  );

const haltEpic = (action) =>
  action.pipe(
    ofType(player.halt),
    tap(() => {
      Speech.stop();
    }),
    map(() => parser.reset())
  );

const softHaltEpic = (action) =>
  action.pipe(
    ofType(player.softHalt),
    tap(() => {
      Speech.stop();
    }),
    ignoreElements()
  );

const overloadEpic = (action) =>
  action.pipe(
    ofType(player.overload),
    concatMap(() =>
      of(
        notification.warning({
          text: 'Overload! Player will enable again shortly',
        }),
        route.cooldown(),
        player.chill()
      )
    )
  );

const chillEpic = (action) =>
  action.pipe(
    ofType(player.chill),
    delay(30000),
    map(() => player.ready())
  );

const waitEpic = (action) =>
  action.pipe(
    ofType(player.wait),
    tap(() => {
      // console.log('pauseEpic');
      Speech.pause();
    }),
    ignoreElements()
  );

const nextEpic = (action, state) =>
  action.pipe(
    ofType(player.next),
    pluck('payload'),
    filter(
      (payload = {}) =>
        (!isGoogleBook(parserTypeSelector(state.value)) || payload.auto) &&
        !isStopped(playerStatusSelector(state.value))
    ),
    tap((payload) => {
      console.log('player.next', payload);
      mpToContent(
        [ highlight.clearWords(), highlight.section(), ],
        playerTabSelector(state.value)
      );
    }),
    concatMap((payload = {}) =>
      from([
        player.wait(),
        payload.auto ? player.nextAuto() : player.nextSlow(),
      ])
    )
  );

const nextPageEpic = (action, state) =>
  action.pipe(
    ofType(player.next),
    pluck('payload'),
    filter(
      (payload = {}) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ player.stop(), player.nextMove(), ]))
  );

const nextMoveEpic = (action, state) =>
  action.pipe(
    ofType(player.nextMove),
    tap((payload) => {
      console.log('nextMoveEpic', payload);
      mpToContent(page.next(), playerTabSelector(state.value));
    }),
    switchMap(() => action.pipe(ofType(page.moveComplete), first())),
    delay(500),
    tap(() => {
      mpToContent(
        sections.requestAndPlay({ userGenerated: true, }),
        playerTabSelector(state.value)
      );
    })
  );

const prevPageEpic = (action, state) =>
  action.pipe(
    ofType(player.prev),
    pluck('payload'),
    filter(
      (payload = {}) =>
        !payload.auto && isGoogleBook(parserTypeSelector(state.value))
    ),
    concatMap(() => from([ player.stop(), player.prevMove(), ]))
  );

const prevMoveEpic = (action, state) =>
  action.pipe(
    ofType(player.prevMove),
    tap((payload) => {
      console.log('prevMoveEpic', payload);
      mpToContent(page.prev(), playerTabSelector(state.value));
    }),
    switchMap(() => action.pipe(ofType(page.moveComplete), first())),
    delay(500),
    tap(() => {
      mpToContent(
        sections.requestAndPlay({ userGenerated: true, }),
        playerTabSelector(state.value)
      );
    })
  );

const softNextEpic = (action, state) =>
  action.pipe(
    ofType(player.softNext),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() => player.next())
  );

const softPrevEpic = (action, state) =>
  action.pipe(
    ofType(player.softPrev),
    filter(() => !isStopped(playerStatusSelector(state.value))),
    map(() => player.prev())
  );

const endIframeEpic = (action, state) =>
  action.pipe(
    ofType(player.end),
    filter(() => {
      const someIframes = parserIframesSelector(state.value);
      return !Object.values(someIframes).every((val) => isIframeParsing(val));
    }),
    pluck('payload'),
    tap((payload) => {
      console.log('endIframeEpic', payload);
      mpToContent(
        [ sections.requestAndPlay({ ...payload, userGenerated: true, }), ],
        playerTabSelector(state.value)
      );
    }),
    ignoreElements()
  );

const endEpic = (action, state) =>
  action.pipe(
    ofType(player.end),
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
          parser.reset({ revertHtml: true, }),
          player.reset(),
          parser.set({
            type: parserTypeSelector(state.value),
            page: nextPage,
            maxPage: parserMaxPageSelector(state.value),
          }),
          page.move({ index: nextPage, }),
        ],
        playerTabSelector(state.value)
      );
    }),
    switchMap(() => action.pipe(ofType(page.moveComplete), first())),
    delay(500),
    concatMap(() => of(player.play()))
  );

const endPageEpic = (action, state) =>
  action.pipe(
    ofType(player.end),
    filter(() => isGoogleBook(parserTypeSelector(state.value))),
    concatMap(() => from([ player.stop(), player.nextMove(), ]))
  );

const nextAutoEpic = (action) =>
  action.pipe(
    ofType(player.nextAuto),
    tap(() => {
      console.log('player.nextAuto');
    }),
    map(() => player.play())
  );

const nextEpicThrottled = (action) =>
  action.pipe(
    ofType(player.nextSlow),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.nextSlow');
    }),
    map(() => player.play())
  );

const demandPlayEpic = (action, state) =>
  action.pipe(
    ofType(player.demand),
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
    ofType(player.prev),
    pluck('payload'),
    filter(
      (payload = {}) =>
        (!isGoogleBook(parserTypeSelector(state.value)) || payload.auto) &&
        !isStopped(playerStatusSelector(state.value))
    ),
    tap(() => {
      console.log('player.prev');
      mpToContent(
        [ highlight.clearWords(), highlight.section(), ],
        playerTabSelector(state.value)
      );
    }),
    concatMap(() => of(player.wait(), player.prevSlow()))
  );

const prevEpicThrottled = (action) =>
  action.pipe(
    ofType(player.prevSlow),
    debounceTime(ATTRIBUTES.MISC.PLAYER_THROTTLE_TIME),
    tap(() => {
      console.log('player.prev');
    }),
    map(() => player.play())
  );

const crashEpic = (action, state) =>
  action.pipe(
    ofType(player.crash),
    tap(() => {
      console.log('player.crash');
    }),
    pluck('payload', 'message'),
    concatMap((text) =>
      appSkipDeadSectionsSelector(state.value)
        ? of(route.index(), player.next())
        : of(notification.warning({ text, }), route.skip())
    )
  );

export default combineEpics(
  // continueEpic,
  // resumeEventEpic,
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
  overloadEpic,
  chillEpic,
  crashEpic,
  haltEpic,
  softHaltEpic,
  endEpic,
  timeoutEpic,
  healthCheckEpic,
  toggleEpic,
  softNextEpic,
  softPrevEpic,
  seekEpic
);
