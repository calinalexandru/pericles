import { getType, } from '@reduxjs/toolkit';
import { combineEpics, ofType, } from 'redux-observable';
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
  EpicFunction,
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
  isWindowTop,
  removeAllHelperTags,
  scrollToGoogleDocsPage,
} from '@pericles/util';

import { mapPayloadToResponse, processResponse, } from './util';

export const sectionsRequestAndPlayRequestEpic: EpicFunction = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(getType(playerActions.sectionsRequestAndPlay)),
    map((action) => action.payload),
    withLatestFrom(state$),
    map(([ payload, state, ]) => mapPayloadToResponse(payload, state)),
    withLatestFrom(state$),
    concatMap(([ response, state, ]) => processResponse(response, state))
  );

export const pageMoveEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(parserActions.pageMove)),
    pluck('payload'),
    tap((payload) => {
      console.log('pageMoveEpic', payload);
      const isIframe = !isWindowTop();
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
    map(() => parserActions.pageMoveComplete())
  );

// export const pageNextEpic: EpicFunction = (action, state) =>
//   action.pipe(
//     ofType(getType(parserActions.nextPage)),
//     filter(
//       () => !isWindowTop() && isGoogleBook(parserTypeSelector(state.value))
//     ),
//     switchMap(() =>
//       from(clickNextGoogleBookPage()).pipe(
//         map(() => of(true)),
//         catchError(() => of(false))
//       )
//     ),
//     switchMap(() =>
//       from(
//         mutationCheck(
//           getViewportByDocType(window, parserTypeSelector(state.value)),
//           500
//         )
//       ).pipe(
//         of(parserActions.pageMoveComplete()),
//         catchError(() => of(playerActions.idle()))
//       )
//     )
//   );

// export const pagePrevEpic: EpicFunction = (action, state) =>
//   action.pipe(
//     ofType(getType(parserActions.prevPage)),
//     pluck('payload'),
//     filter(
//       () => !isWindowTop() && isGoogleBook(parserTypeSelector(state.value))
//     ),
//     tap(async () => {
//       console.log('pagePrevEpic');
//       await clickPrevGoogleBookPage();
//     }),
//     switchMap((isAllowed) =>
//       from(
//         isAllowed &&
//           mutationCheck(
//             getViewportByDocType(window, parserTypeSelector(state.value)),
//             500
//           )
//       )
//     ),
//     catchError(() => of(false)),
//     concatMap((check) =>
//       of(check ? parserActions.pageMoveComplete() : playerActions.idle())
//     )
//   );

export const pageAutosetEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(parserActions.pageAutoset)),
    filter(() => isWindowTop() === true),
    map(() => {
      console.log('pageAutosetEpic', action);
      const pageIndex = getGoogleDocsPageByScroll();
      console.log('page.autoset', pageIndex);
      return parserActions.set({ page: pageIndex, });
    })
  );

export const clearHelperTagsEpic: EpicFunction = (action) =>
  action.pipe(
    ofType(getType(parserActions.reset)),
    pluck('payload', 'revertHtml'),
    filter((revertHtml) => revertHtml === true),
    tap(removeAllHelperTags),
    ignoreElements()
  );

export default combineEpics(
  // pageNextEpic,
  // pagePrevEpic,
  sectionsRequestAndPlayRequestEpic,
  clearHelperTagsEpic,
  pageMoveEpic,
  pageAutosetEpic
);
