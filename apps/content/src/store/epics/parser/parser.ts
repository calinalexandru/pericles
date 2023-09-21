import { PayloadAction, getType, } from '@reduxjs/toolkit';
import { Epic, ofType, } from 'redux-observable';
import { from, of, } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  filter,
  ignoreElements,
  map,
  pluck,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import mutationCheck from '@/util/mutationCheck';
import { PARSER_TYPES, ParserTypes, } from '@pericles/constants';
import {
  RootState,
  combineAnyEpics,
  parserActions,
  parserTypeSelector,
  playerActions,
} from '@pericles/store';
import {
  clickNextGoogleBookPage,
  clickPrevGoogleBookPage,
  getGoogleDocsPageByScroll,
  getViewportByDocType,
  isGoogleBook,
  removeAllHelperTags,
  scrollToGoogleDocsPage,
} from '@pericles/util';

import { PayloadType, mapPayloadToResponse, processResponse, } from './util';

export const sectionsRequestAndPlayRequestEpic: Epic<
  PayloadAction<PayloadType>,
  PayloadAction<any>,
  RootState
> = (action$, state$) =>
  action$.pipe(
    ofType(getType(playerActions.sectionsRequestAndPlay)),
    map((action) => action.payload),
    withLatestFrom(state$),
    map(([ payload, state, ]) => mapPayloadToResponse(payload, state)),
    withLatestFrom(state$),
    concatMap(([ response, state, ]) => processResponse(response, state))
  );

export const pageMoveEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(parserActions.pageMove)),
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
    map(parserActions.pageMoveComplete)
  );

export const pageNextEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(parserActions.nextPage)),
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
    concatMap((check) =>
      of(check ? parserActions.pageMoveComplete() : playerActions.idle())
    )
  );

export const pagePrevEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(getType(parserActions.prevPage)),
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
    concatMap((check) =>
      of(check ? parserActions.pageMoveComplete() : playerActions.idle())
    )
  );

export const pageAutosetEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(parserActions.pageAutoset)),
    pluck('payload'),
    filter((payload) => !payload.iframe),
    map(() => {
      console.log('pageAutosetEpic', action);
      const pageIndex = getGoogleDocsPageByScroll();
      console.log('page.autoset', pageIndex);
      return parserActions.set({ page: pageIndex, });
    })
  );

export const clearHelperTagsEpic: Epic<any> = (action) =>
  action.pipe(
    ofType(getType(parserActions.reset)),
    pluck('payload', 'revertHtml'),
    filter((revertHtml) => revertHtml === true),
    tap(removeAllHelperTags),
    ignoreElements()
  );

export default combineAnyEpics(
  pageNextEpic,
  pagePrevEpic,
  sectionsRequestAndPlayRequestEpic,
  clearHelperTagsEpic,
  pageMoveEpic,
  pageAutosetEpic
);
