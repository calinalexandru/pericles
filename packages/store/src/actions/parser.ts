import { createAction, } from '@reduxjs/toolkit';

import { ParserState, } from '../initialState';

export enum ParserActionTypes {
  SET = 'PARSER/SET',
  RESET = 'PARSER/RESET',
  RESET_COMPLETE = 'PARSER/RESET_COMPLETE',
  WORDS_UPDATE = 'PARSER/WORDS_UPDATE',
  WORDS_UPDATE_WORKER = 'PARSER/WORDS_UPDATE_WORKER',
  IDLE = 'PARSER/IDLE',
}

export enum PageActionTypes {
  SET = 'PAGE/SET',
  NEXT = 'PAGE/NEXT',
  PREV = 'PAGE/PREV',
  MOVE = 'PAGE/MOVE',
  MOVE_COMPLETE = 'PAGE/MOVE_COMPLETE',
  AUTOSET = 'PAGE/AUTOSET',
}

export const setPage = createAction<Partial<ParserState>>(PageActionTypes.SET);
export const nextPage = createAction(PageActionTypes.NEXT);
export const prevPage = createAction(PageActionTypes.PREV);
export const pageMove = createAction<{ index: number }>(PageActionTypes.MOVE);
export const pageMoveComplete = createAction(PageActionTypes.MOVE_COMPLETE);
export const pageAutoset = createAction(PageActionTypes.AUTOSET);

export const setParser = createAction<Partial<ParserState>>(
  ParserActionTypes.SET
);

export const resetParser = createAction<{ revertHtml: boolean }>(
  ParserActionTypes.RESET
);

export const parserResetComplete = createAction(
  ParserActionTypes.RESET_COMPLETE
);

export const parserWordsUpdate = createAction<any>(
  ParserActionTypes.WORDS_UPDATE
);

export const parserWordsUpdateWorker = createAction<any>(
  ParserActionTypes.WORDS_UPDATE_WORKER
);

export const parserIdle = createAction(ParserActionTypes.IDLE);
