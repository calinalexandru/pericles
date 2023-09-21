import { PayloadAction, createAction, createSlice, } from '@reduxjs/toolkit';

import { ParserState, initialState, } from '../initialState';

const parserSlice = createSlice({
  name: 'parser',
  initialState: initialState.parser,
  reducers: {
    set: (parserState, action: PayloadAction<Partial<ParserState>>) => {
      Object.assign(parserState, action.payload);
    },
    reset: (parserState, action: PayloadAction<{ revertHtml: boolean }>) => {
      Object.assign(parserState, { ...initialState.parser, ...action.payload, });
    },
    pageSet: (parserState, action: PayloadAction<number>) => {
      parserState.page = action.payload;
    },
  },
});

const sideEffectActions = {
  nextPage: createAction('parser/nextPage'),
  prevPage: createAction('parser/prevPage'),
  pageMove: createAction<{ index: number }>('parser/pageMove'),
  pageMoveComplete: createAction('parser/pageMoveComplete'),
  pageAutoset: createAction('parser/pageAutoset'),
};

const { actions: reducerActions, reducer, } = parserSlice;

export const parserActions = { ...reducerActions, ...sideEffectActions, };
export const parserReducer = reducer;
