import { Epic, combineEpics, ofType, } from 'redux-observable';
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
import {
  ATTRIBUTES,
  PARSER_TYPES,
  PLAYER_STATUS,
  ParserTypes,
} from '@pericles/constants';
import {
  PageActionTypes,
  ParserActionTypes,
  appSkipUntilYSelector,
  notificationError,
  pageMoveComplete,
  parserIdle,
  parserIframesSelector,
  parserKeySelector,
  parserPageSelector,
  parserResetComplete,
  parserTypeSelector,
  parserWordsUpdateWorker,
  playerEnd,
  playerError,
  playerIdle,
  playerKeySelector,
  playerNext,
  playerProxyPlay,
  playerSectionsSelector,
  playerStop,
  routeErrorPdf,
  sectionsRequestAndPlay,
  setParser,
  setPlayer,
  setSections,
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
  t,
  wrapWordTagAzure,
} from '@pericles/util';

const mergedLanguages = [ 'ja', 'cn', 'ko', ];

export const getSectionsAndPlayEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(sectionsRequestAndPlay.request),
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
      const userGenerated = payload?.userGenerated || false;
      const fromCursor = payload.fromCursor || false;
      const working = payload.working || false;
      const tab = payload.tab || 0;
      const parserKey = parserKeySelector(state.value);
      const voiceProp = settingsVoiceSelector(state.value);
      const skipUntilY = appSkipUntilYSelector(state.value);
      const voices: any = settingsVoiceSelector(state.value);
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
        parserIframes,
        fromCursor,
        working,
      });

      const { out, maxPage, pageIndex, blocked, } = domStrategy.getSections();

      // console.log('domStrategy.getSections', {out, maxPage, pageIndex, blocked,})

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
        Object.keys(sectionsArr).map(
          (key: string) => Number(parserKey) + Number(key)
        ),
        jpLang
      );

      return {
        sections: out.map(({ text, pos, }) => ({ text, ...(pos && { pos, }), })),
        fromCursor,
        iframes,
        isIframe,
        end:
          (
            [
              PARSER_TYPES.GOOGLE_DOC,
              PARSER_TYPES.GOOGLE_DOC_SVG,
              PARSER_TYPES.GOOGLE_BOOK,
              PARSER_TYPES.GOOGLE_FORM,
            ] as ParserTypes[]
          ).includes(parserType) ||
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
        maxPage = 0,
        type = PARSER_TYPES.DEFAULT,
        pageIndex,
        iframes,
        isIframe,
        sections: sectionsArr = [],
        tab,
        error,
      }) => {
        if (error) {
          return [
            setPlayer({ status: PLAYER_STATUS.ERROR, }),
            sectionsRequestAndPlay.success(),
            routeErrorPdf(),
          ];
        }
        if (skip) {
          if (!isIframe && !sectionsArr.length && end) {
            const availableIframeKey: string | boolean =
              findAvailableIframe(iframes);
            let newIframes = iframes;
            if (availableIframeKey !== false) {
              newIframes = {
                ...iframes,
                ...{
                  [availableIframeKey as string]: {
                    ...iframes[availableIframeKey as string],
                    parsing: true,
                  },
                },
              };
            }
            console.log('newIframes', newIframes);
            return [
              setParser({
                iframes,
                end,
                type,
                maxPage,
                page: pageIndex,
              }),
              playerEnd({
                fromCursor,
                iframes: newIframes,
              }),
            ];
          }
          if (skip && message)
            return [ playerError(), notificationError({ text: message, }), ];
          return [ playerIdle(), ];
        }
        const mergeSections = [
          ...playerSectionsSelector(state.value),
          ...sectionsArr,
        ];
        if (!mergeSections.length && isGoogleBook(type)) {
          return from([
            setParser({ type, maxPage, page: pageIndex, end, }),
            playerNext({ auto: false, }),
          ]);
        }
        return from(
          maxPage === 0 || maxPage > parserPageSelector(state.value)
            ? [
              setSections({ sections: mergeSections, }),
              setParser({
                iframes,
                key: mergeSections.length,
                end,
                type,
                maxPage,
                page: pageIndex,
              }),
              playerProxyPlay({ tab, }),
              sectionsRequestAndPlay.success(),
            ]
            : [ playerStop(), sectionsRequestAndPlay.success(), ]
        );
      }
    )
  );

export const pageMoveEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(PageActionTypes.MOVE),
    pluck('payload'),
    tap(async (payload) => {
      console.log('pageMoveEpic', payload);
      const isIframe = payload.iframe;
      const parserType = parserTypeSelector(state.value);
      if (
        !isIframe &&
        (
          [
            PARSER_TYPES.GOOGLE_DOC,
            PARSER_TYPES.GOOGLE_DOC_SVG,
          ] as ParserTypes[]
        ).includes(parserType)
      ) {
        scrollToGoogleDocsPage(payload.index);
      }
    }),
    delay(500),
    map(pageMoveComplete)
  );

export const pageNextEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(PageActionTypes.NEXT),
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
    concatMap((check) => of(check ? pageMoveComplete() : playerIdle()))
  );

export const pagePrevEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(PageActionTypes.PREV),
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
    concatMap((check) => of(check ? pageMoveComplete() : playerIdle()))
  );

export const pageAutosetEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(PageActionTypes.AUTOSET),
    pluck('payload'),
    filter((payload) => !payload.iframe),
    map(() => {
      console.log('pageAutosetEpic', action);
      const pageIndex = getGoogleDocsPageByScroll();
      console.log('page.autoset', pageIndex);
      return setParser({ page: pageIndex, });
    })
  );

export const wordsUpdateEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(ParserActionTypes.WORDS_UPDATE),
    pluck('payload', 'wordList'),
    map((wordList) => {
      console.log('wordsUpdateEpic');
      const sectionsArr = getSectionsById(playerKeySelector(state.value));
      removeWordTags(sectionsArr);
      return parserWordsUpdateWorker({
        sections: sectionsArr,
        wordList,
      });
    })
  );

export const wordsUpdateWorkerEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(ParserActionTypes.WORDS_UPDATE_WORKER),
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
          return parserWordsUpdateWorker({
            sections: sectionsSliced,
            wordList: out.wordList,
            wordIndex: out.wordIndex,
          });
        }
      }
      return parserIdle();
    })
  );

export const clearHelperTagsEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(ParserActionTypes.RESET),
    pluck('payload', 'revertHtml'),
    filter((revertHtml) => revertHtml === true),
    tap(removeAllHelperTags),
    map(parserResetComplete)
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