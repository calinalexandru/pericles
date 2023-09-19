import { PayloadAction, } from '@reduxjs/toolkit';
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
  withLatestFrom,
} from 'rxjs/operators';

import mutationCheck from '@/util/mutationCheck';
import { PARSER_TYPES, ParserTypes, } from '@pericles/constants';
import {
  PageActionTypes,
  ParserActionTypes,
  RootState,
  pageMoveComplete,
  parserIdle,
  parserResetComplete,
  parserTypeSelector,
  parserWordsUpdateWorker,
  playerIdle,
  playerKeySelector,
  sectionsRequestAndPlay,
  setParser,
} from '@pericles/store';
import {
  clickNextGoogleBookPage,
  clickPrevGoogleBookPage,
  getGoogleDocsPageByScroll,
  getSectionsById,
  getViewportByDocType,
  isGoogleBook,
  removeAllHelperTags,
  removeWordTags,
  scrollToGoogleDocsPage,
  wrapWordTagAzure,
} from '@pericles/util';

import { PayloadType, mapPayloadToResponse, processResponse, } from './util';

export const sectionsRequestAndPlayRequestEpic: Epic<
  PayloadAction<PayloadType>,
  PayloadAction<any>,
  RootState
> = (action$, state$) =>
  action$.pipe(
    ofType(sectionsRequestAndPlay.actionTypes.REQUEST),
    map((action) => action.payload),
    withLatestFrom(state$),
    map(([ payload, state, ]) => mapPayloadToResponse(payload, state)),
    withLatestFrom(state$),
    concatMap(([ response, state, ]) => processResponse(response, state))
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
  sectionsRequestAndPlayRequestEpic,
  clearHelperTagsEpic,
  wordsUpdateEpic,
  wordsUpdateWorkerEpic,
  pageMoveEpic,
  pageAutosetEpic
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
) as any;
