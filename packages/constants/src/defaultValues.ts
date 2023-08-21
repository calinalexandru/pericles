import { Variables, } from './interfaces';
import PARSER_TYPES from './parserTypes';
import PLAYER_STATUS from './playerStatus';
import ROUTES from './routes';
import SECTION_HIGHLIGHT_STYLES from './sectionHighlightStyles';
import TABS from './tabs';
import WORD_TRACKER_STYLES from './wordTrackerStyles';

export const DEFAULT_VALUES: Variables = {
  PARSER: {
    KEY: 0,
    END: false,
    TYPE: PARSER_TYPES.DEFAULT,
    IFRAMES: {},
    PAGE: 0,
    MAX_PAGE: 0,
  },

  AUTH: {
    SUBSCRIPTION: false,
    STATUS: false,
    TOKEN: '',
    BUFFERING: false,
  },

  APP: {
    THEME_MODE: 'light',
    WORD_TRACKER: true,
    WORD_TRACKER_STYLE: WORD_TRACKER_STYLES.UNDERLINE,
    WORD_TRACKER_COLOR: 'rgba(9, 46, 140, 0.92)',
    SECTIONS_TRACKER: true,
    MINI_PLAYER: false,
    SKIP_DEAD_SECTIONS: false,
    AUTOSCROLL: true,
    HIGHLIGHT_COLOR: 'rgba(255, 254, 219, 1.54)',
    HIGHLIGHT_STYLE: SECTION_HIGHLIGHT_STYLES.BACKGROUND,
    ACTIVE_TAB: -1,
    ROUTE: ROUTES.INDEX,
    ROUTE_TAB: TABS.SETTINGS,
    SKIP_UNTIL_Y: 0,
    LANGUAGE: 'en',
    SELECTED_TEXT: '',
  },

  NOTIFICATION: {
    TYPE: 'info',
    TEXT: '',
  },

  SETTINGS: {
    PARAMS: {
      VOLUME: {
        MIN: 0.1,
        MAX: 1,
        STEP: 0.1,
      },
      RATE: {
        MIN: 0.1,
        MAX: 2.5,
        STEP: 0.1,
      },
      PITCH: {
        MIN: 0.1,
        MAX: 2,
        STEP: 0.1,
      },
    },
    VISIBLE: false,
    VOLUME: 0.9,
    RATE: 1.1,
    PITCH: 1,
    VOICE: 0,
    NEURAL_VOICES: [],
    VOICES: [],
  },

  PLAYER: {
    SECTIONS: [],
    KEY: 0,
    STATUS: PLAYER_STATUS.STOPPED,
    TAB: 0,
    BUFFERING: false,
  },

  HOTKEYS: {
    DISABLE: false,
    START: [
      { key: 'Control', code: 'ControlLeft', },
      { key: 'k', code: 'KeyK', },
      { key: 'Shift', code: 'ShiftLeft', },
    ],
    PLAY: [ { key: 'k', code: 'KeyK', }, ],
    NEXT: [ { key: '.', code: 'Period', }, ],
    PREV: [ { key: ',', code: 'Comma', }, ],
    STOP: [ { key: 'j', code: 'KeyJ', }, ],
  },
};
