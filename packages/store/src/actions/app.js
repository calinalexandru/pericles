import { createActions, } from 'redux-actions';

export default createActions({
  APP: {
    SET: null,
    DEFAULT: null,
    TAB_CLOSED: null,
    INIT: null,
    RELOAD: null,
    RELOAD_TAB: null,
    FACTORY_RESET: null,
    NEW_CONTENT: null,
    SELECT_TEXT: null,
  },

  ROUTE: {
    INDEX: null,
    LOGIN: null,
    ERROR: null,
    ERROR_PDF: null,
    USER: null,
    COOLDOWN: null,
    SKIP: null,
  },

  HIGHLIGHT: {
    SECTION: null,
    SENTENCE: null,
    WORD: null,
    CLEAR: null,
    SECTION_COMPLETE: null,
    CLEAR_WORDS: null,
    CLEAR_SECTIONS: null,
    CLEAR_ALL: null,
    CLEAR_WORDS_COMPLETE: null,
    CLEAR_SECTIONS_COMPLETE: null,
    CLEAR_ALL_COMPLETE: null,
    RELOAD_SETTINGS: null,
  },

  AUTOSCROLL: {
    SET: null,
    CLEAR: null,
  },

  CONTENT: {
    LAST: null,
  },
});
