import { createActions, } from 'redux-actions';

export default createActions({
  PARSER: {
    REQUEST: null,
    SUCCESS: null,
    FAILURE: null,
    SET: null,
    RESET: null,
    RESET_COMPLETE: null,
    WORKING: null,
    WORDS_UPDATE: null,
    WORDS_UPDATE_WORKER: null,
    WANK: null,
    SET_CURSOR_Y: null,
    DETECT_TYPE: null,
  },

  PAGE: {
    NEXT: null,
    PREV: null,
    SET: null,
    MOVE: null,
    MOVE_COMPLETE: null,
    AUTOSET: null,
    AUTOSET_COMPLETE: null,
  },
});
