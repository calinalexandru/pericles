import { createAction, } from 'redux-actions';

import { ParserState, } from '../initialState';

export enum ParserTypes {
  SET = 'PARSER/SET',
  RESET = 'PARSER/RESET',
  RESET_COMPLETE = 'PARSER/RESET_COMPLETE',
  WORDS_UPDATE = 'PARSER/WORDS_UPDATE',
  WORDS_UPDATE_WORKER = 'PARSER/WORDS_UPDATE_WORKER',
  IDLE = 'PARSER/IDLE',
}

export enum PageTypes {
  SET = 'PAGE/SET',
  NEXT = 'PAGE/NEXT',
  PREV = 'PAGE/PREV',
  MOVE = 'PAGE/MOVE',
  MOVE_COMPLETE = 'PAGE/MOVE_COMPLETE',
  AUTOSET = 'PAGE/AUTOSET',
}

export const setPage = createAction<Partial<ParserState>>(PageTypes.SET);
export const nextPage = createAction<Partial<ParserState>>(PageTypes.NEXT);
export const prevPage = createAction<Partial<ParserState>>(PageTypes.PREV);
export const pageMove = createAction<Partial<ParserState>>(PageTypes.MOVE);
export const pageMoveComplete = createAction(PageTypes.MOVE_COMPLETE);
export const pageAutoset = createAction(PageTypes.AUTOSET);

export const setParser = createAction<Partial<ParserState>>(ParserTypes.SET);

export const resetParser = createAction<any>(ParserTypes.RESET);

export const parserResetComplete = createAction(ParserTypes.RESET_COMPLETE);

export const parserWordsUpdate = createAction<any>(ParserTypes.WORDS_UPDATE);

export const parserWordsUpdateWorker = createAction<any>(
  ParserTypes.WORDS_UPDATE_WORKER
);

export const parserIdle = createAction(ParserTypes.IDLE);
