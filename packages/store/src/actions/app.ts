import { createAction, } from 'redux-actions';

import { AppState, } from '../initialState';

export enum AppActionTypes {
  SET = 'APP/SET',
  TAB_CLOSED = 'APP/TAB_CLOSED',
  INIT = 'APP/INIT',
  RELOAD = 'APP/RELOAD',
  RELOAD_TAB = 'APP/RELOAD_TAB',
  FACTORY_RESET = 'APP/FACTORY_RESET',
  NEW_CONTENT = 'APP/NEW_CONTENT',
}

export enum RouteActionTypes {
  INDEX = 'ROUTE/INDEX',
  ERROR = 'ROUTE/ERROR',
  ERROR_PDF = 'ROUTE/ERROR_PDF',
  SKIP = 'ROUTE/SKIP',
}

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

export const setApp = createAction<Partial<AppState>>(AppActionTypes.SET);
export const appTabClosed = createAction<number>(AppActionTypes.TAB_CLOSED);
export const appInit = createAction(AppActionTypes.INIT);
export const appReload = createAction(AppActionTypes.RELOAD);
export const appReloadTab = createAction(AppActionTypes.RELOAD_TAB);
export const appFactoryReset = createAction(AppActionTypes.FACTORY_RESET);
export const appNewContent = createAction<any>(AppActionTypes.NEW_CONTENT);

export const routeIndex = createAction(RouteActionTypes.INDEX);
export const routeError = createAction(RouteActionTypes.ERROR);
export const routeErrorPdf = createAction(RouteActionTypes.ERROR_PDF);
export const routeSkip = createAction(RouteActionTypes.SKIP);

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
