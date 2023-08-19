import { t, } from '@lingui/macro';
import { keys, pathOr, } from 'ramda';
import { combineEpics, ofType, } from 'redux-observable';
import { from, of, } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  filter,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';

import DomStrategy from '@/strategy/domStrategy';
import mutationCheck from '@/util/mutationCheck';
import { ATTRIBUTES, PARSER_TYPES, PLAYER_STATUS, } from '@pericles/constants';
import {
  appActions,
  appSkipUntilYSelector,
  notificationActions,
  parserActions,
  parserIframesSelector,
  parserKeySelector,
  parserPageSelector,
  parserTypeSelector,
  playerActions,
  playerKeySelector,
  playerSectionsSelector,
  settingsNeuralVoicesSelector,
  settingsVoiceSelector,
} from '@pericles/store';
import {
  clickNextGoogleBookPage,
  clickPrevGoogleBookPage,
  findAvailableIframe,
  findWorkingIframe,
  getGoogleDocsPageByScroll,
  getIframesForStore,
  getParserType,
  getPremiumVoiceId,
  getSectionsById,
  getViewportByDocType,
  isGoogleBook,
  isGoogleUtility,
  isGrammarlyApp,
  isIframeParsing,
  isPdfPage,
  isPremiumVoice,
  removeAllHelperTags,
  removeWordTags,
  scrollToGoogleDocsPage,
  splitSentencesIntoWords,
  wrapWordTagAzure,
} from '@pericles/util';

const { sections, player, } = playerActions;
const { parser, page, } = parserActions;
const { route, } = appActions;
const { notification, } = notificationActions;

const mergedLanguages = [ 'ja', 'cn', 'ko', ];

export const getSectionsAndPlayEpic = (action, state) =>
  action.pipe(
    ofType(sections.requestAndPlay),
    pluck('payload'),
    tap((data) => {
      console.log('getSectionsAndPlayEpic.init', action, state, data);
    }),
    map((payload) => {
      const parserType = getParserType(window);
      if (isGrammarlyApp(parserType)) {
        return {
          skip: true,
          message: t`grammarly_app_not_supported`,
        };
      }
      const isIframe = payload.iframe;
      const { hostname, } = window.location;
      if (isPdfPage(window)) {
        return {
          error: 'Pdf page error',
        };
      }
      const parserIframes =
        payload?.iframes || parserIframesSelector(state.value);
      if (
        (isGoogleBook(parserType) && !isIframe) ||
        (!isGoogleUtility(parserType) &&
          !isIframe &&
          findWorkingIframe(parserIframes) !== false) ||
        (!isGoogleUtility(parserType) &&
          isIframe &&
          !isIframeParsing(hostname, parserIframes))
      ) {
        return { skip: true, };
      }

      const iframes =
        (Object.keys(parserIframes).length && parserIframes) ||
        (!isGoogleUtility(parserType) && getIframesForStore(window)) ||
        {};
      const userGenerated = pathOr(false, [ 'userGenerated', ], payload);
      const fromCursor = pathOr(false, [ 'fromCursor', ], payload);
      const working = pathOr(false, [ 'working', ], payload);
      const tab = pathOr(0, [ 'tab', ], payload);
      const parserKey = parserKeySelector(state.value);
      const voiceProp = settingsVoiceSelector(state.value);
      const skipUntilY = appSkipUntilYSelector(state.value);
      const voices = isPremiumVoice(voiceProp)
        ? settingsNeuralVoicesSelector(state.value)
        : settingsVoiceSelector(state.value);
      const newVoiceProp = isPremiumVoice(voiceProp)
        ? getPremiumVoiceId(voiceProp)
        : voiceProp;
      const { lang, } = voices[newVoiceProp] || {};
      const jpLang = !!mergedLanguages.includes(lang);

      const domStrategy = new DomStrategy({
        parserType,
        userGenerated,
        skipUntilY,
        parserKey,
        fromCursor,
        working,
      });

      const { out, maxPage, pageIndex, blocked, } = domStrategy.getSections();

      if (!out.length)
        return {
          fromCursor,
          skip: true,
          iframes,
          isIframe,
          sections: [],
          end: true,
          type: parserType,
          maxPage,
          tab,
          pageIndex,
        };

      const sectionsArr = out.map((data) => data.text);
      splitSentencesIntoWords(
        keys(sectionsArr).map((key) => Number(parserKey) + Number(key)),
        jpLang
      );

      return {
        sections: out.map(({ text, pos, }) => ({ text, pos, })),
        fromCursor,
        iframes,
        isIframe,
        end:
          [
            PARSER_TYPES.GOOGLE_DOC,
            PARSER_TYPES.GOOGLE_DOC_SVG,
            PARSER_TYPES.GOOGLE_BOOK,
            PARSER_TYPES.GOOGLE_FORM,
          ].includes(parserType) ||
          sectionsArr.length < ATTRIBUTES.MISC.MIN_SECTIONS ||
          blocked,
        maxPage,
        pageIndex,
        type: parserType,
        tab,
      };
    }),
    tap((data) => {
      console.log('sectionsData', data);
    }),
    concatMap(
      ({
        fromCursor,
        message,
        skip,
        end,
        maxPage,
        type,
        pageIndex,
        iframes,
        isIframe,
        sections: sectionsArr = [],
        tab,
        error,
      }) => {
        if (error) {
          return [
            player.set({ status: PLAYER_STATUS.ERROR, }),
            sections.requestAndPlayComplete(),
            route.errorPdf(),
          ];
        }
        if (skip) {
          if (!isIframe && !sectionsArr.length && end) {
            const availableIframeKey = findAvailableIframe(iframes);
            let newIframes = iframes;
            if (availableIframeKey) {
              newIframes = {
                ...iframes,
                ...{
                  [availableIframeKey]: {
                    ...iframes[availableIframeKey],
                    parsing: true,
                  },
                },
              };
            }
            console.log('newIframes', newIframes);
            return [
              parser.set({
                iframes,
                end,
                type,
                maxPage,
                page: pageIndex,
              }),
              player.end({
                fromCursor,
                iframes: newIframes,
              }),
            ];
          }
          if (skip && message)
            return [ player.error(), notification.error({ text: message, }), ];
          return [ player.wank(), ];
        }
        const mergeSections = [
          ...playerSectionsSelector(state.value),
          ...sectionsArr,
        ];
        if (!mergeSections.length && isGoogleBook(type)) {
          return from([
            parser.set({ type, maxPage, page: pageIndex, end, }),
            player.next(),
          ]);
        }
        return from(
          maxPage === 0 || maxPage > parserPageSelector(state.value)
            ? [
              sections.set({ sections: mergeSections, }),
              parser.set({
                iframes,
                key: mergeSections.length,
                end,
                type,
                maxPage,
                page: pageIndex,
              }),
              player.proxyPlay({ tab, }),
              sections.requestAndPlayComplete(),
            ]
            : [ player.stop(), sections.requestAndPlayComplete(), ]
        );
      }
    )
  );

export const pageMoveEpic = (action, state) =>
  action.pipe(
    ofType(page.move),
    pluck('payload'),
    tap(async (payload) => {
      console.log('pageMoveEpic', payload);
      const isIframe = payload.iframe;
      const parserType = parserTypeSelector(state.value);
      if (
        !isIframe &&
        [ PARSER_TYPES.GOOGLE_DOC, PARSER_TYPES.GOOGLE_DOC_SVG, ].includes(
          parserType
        )
      ) {
        scrollToGoogleDocsPage(payload.index);
      }
    }),
    delay(500),
    map(() => page.moveComplete())
  );

export const pageNextEpic = (action, state) =>
  action.pipe(
    ofType(page.next),
    pluck('payload'),
    filter(
      (payload = {}) =>
        payload.iframe && isGoogleBook(parserTypeSelector(state.value))
    ),
    tap(async () => {
      console.log('pageNextEpic');
      await clickNextGoogleBookPage();
    }),
    switchMap((isAllowed) =>
      from(
        isAllowed &&
          mutationCheck(
            getViewportByDocType(window, parserTypeSelector(state.value)),
            500
          )
      )
    ),
    catchError(() => of(false)),
    concatMap((check) => of(check ? page.moveComplete() : player.wank()))
  );

export const pagePrevEpic = (action, state) =>
  action.pipe(
    ofType(page.prev),
    pluck('payload'),
    filter(
      (payload = {}) =>
        payload.iframe && isGoogleBook(parserTypeSelector(state.value))
    ),
    tap(async () => {
      console.log('pagePrevEpic');
      await clickPrevGoogleBookPage();
    }),
    switchMap((isAllowed) =>
      from(
        isAllowed &&
          mutationCheck(
            getViewportByDocType(window, parserTypeSelector(state.value)),
            500
          )
      )
    ),
    catchError(() => of(false)),
    concatMap((check) => of(check ? page.moveComplete() : player.wank()))
  );

export const pageAutosetEpic = (action) =>
  action.pipe(
    ofType(page.autoset),
    pluck('payload'),
    filter((payload) => !payload.iframe),
    map(() => {
      console.log('pageAutosetEpic', action);
      const pageIndex = getGoogleDocsPageByScroll();
      console.log('page.autoset', pageIndex);
      return parser.set({ page: pageIndex, });
    })
  );

export const wordsUpdateEpic = (action, state) =>
  action.pipe(
    ofType(parser.wordsUpdate),
    pluck('payload', 'wordList'),
    map((wordList) => {
      console.log('wordsUpdateEpic');
      const sectionsArr = getSectionsById(playerKeySelector(state.value));
      removeWordTags(sectionsArr);
      return parser.wordsUpdateWorker({
        sections: sectionsArr,
        wordList,
      });
    })
  );

export const wordsUpdateWorkerEpic = (action) =>
  action.pipe(
    ofType(parser.wordsUpdateWorker),
    pluck('payload'),
    map(({ sections: sectionsArr, wordList, wordIndex = 0, }) => {
      const [ { childNodes: [ node = false, ] = [], } = {}, ] = sectionsArr;
      console.log('wordsUpdateEpicWorker', sectionsArr, node);
      if (node) {
        const out = wrapWordTagAzure({
          node,
          wordList,
          wordIndex,
        });
        const sectionsSliced = sectionsArr.slice(1);
        if (sectionsSliced.length) {
          return parser.wordsUpdateWorker({
            sections: sectionsSliced,
            wordList: out.wordList,
            wordIndex: out.wordIndex,
          });
        }
      }
      return parser.wank();
    })
  );

export const clearHelperTagsEpic = (action) =>
  action.pipe(
    ofType(parser.reset),
    pluck('payload', 'revertHtml'),
    filter((revertHtml) => revertHtml === true),
    tap(removeAllHelperTags),
    map(() => parser.resetComplete())
  );

export default combineEpics(
  pageNextEpic,
  pagePrevEpic,
  getSectionsAndPlayEpic,
  clearHelperTagsEpic,
  wordsUpdateEpic,
  wordsUpdateWorkerEpic,
  pageMoveEpic,
  pageAutosetEpic
);
