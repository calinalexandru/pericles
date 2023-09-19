import { createAction, } from '@reduxjs/toolkit';

export enum HighlightActionTypes {
  SECTION = 'HIGHLIGHT/SECTION',
  WORD = 'HIGHLIGHT/WORD',
  SECTION_COMPLETE = 'HIGHLIGHT/SECTION_COMPLETE',
  CLEAR_WORDS = 'HIGHLIGHT/CLEAR_WORDS',
  CLEAR_SECTIONS = 'HIGHLIGHT/CLEAR_SECTIONS',
  CLEAR_WORDS_COMPLETE = 'HIGHLIGHT/CLEAR_WORDS_COMPLETE',
  CLEAR_SECTIONS_COMPLETE = 'HIGHLIGHT/CLEAR_SECTIONS_COMPLETE',
  RELOAD_SETTINGS = 'HIGHLIGHT/RELOAD_SETTINGS',
}

export enum AutoscrollActionTypes {
  SET = 'AUTOSCROLL/SET',
  CLEAR = 'AUTOSCROLL/CLEAR',
}

export const highlightSection = createAction(HighlightActionTypes.SECTION);
export const highlightWord = createAction<any>(HighlightActionTypes.WORD);
export const highlightSectionComplete = createAction(
  HighlightActionTypes.SECTION_COMPLETE
);
export const highlightClearWords = createAction(
  HighlightActionTypes.CLEAR_WORDS
);
export const highlightClearSections = createAction(
  HighlightActionTypes.CLEAR_SECTIONS
);
export const highlightClearWordsComplete = createAction(
  HighlightActionTypes.CLEAR_WORDS_COMPLETE
);
export const highlightClearSectionsComplete = createAction(
  HighlightActionTypes.CLEAR_SECTIONS_COMPLETE
);
export const highlightReloadSettings = createAction(
  HighlightActionTypes.RELOAD_SETTINGS
);

export const autoscrollSet = createAction<any>(AutoscrollActionTypes.SET);
export const autoscrollClear = createAction(AutoscrollActionTypes.CLEAR);
