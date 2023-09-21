import { PayloadAction, createSlice, } from '@reduxjs/toolkit';

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

    // side effect actions
    nextPage: (parserState) => parserState,
    prevPage: (parserState) => parserState,
    pageMoveComplete: (parserState) => parserState,
    pageAutoset: (parserState) => parserState,
    pageMove: (parserState, _action: PayloadAction<{ index: number }>) =>
      parserState,
  },
});

export const { actions: parserActions, reducer: parserReducer, } = parserSlice;
