import { VARIABLES, DEFAULT_VALUES, } from '@pericles/constants';

export default {
  parser: {
    [VARIABLES.PARSER.KEY]: DEFAULT_VALUES.PARSER.KEY,
    [VARIABLES.PARSER.END]: DEFAULT_VALUES.PARSER.END,
    [VARIABLES.PARSER.TYPE]: DEFAULT_VALUES.PARSER.TYPE,
    [VARIABLES.PARSER.PAGE]: DEFAULT_VALUES.PARSER.PAGE,
    [VARIABLES.PARSER.MAX_PAGE]: DEFAULT_VALUES.PARSER.MAX_PAGE,
    [VARIABLES.PARSER.IFRAMES]: {},
  },
  app: {
    [VARIABLES.APP.SELECTED_TEXT]: DEFAULT_VALUES.APP.SELECTED_TEXT,
    [VARIABLES.APP.THEME_MODE]: DEFAULT_VALUES.APP.THEME_MODE,
    [VARIABLES.APP.WORD_TRACKER]: DEFAULT_VALUES.APP.WORD_TRACKER,
    [VARIABLES.APP.WORD_TRACKER_COLOR]: DEFAULT_VALUES.APP.WORD_TRACKER_COLOR,
    [VARIABLES.APP.WORD_TRACKER_STYLE]: DEFAULT_VALUES.APP.WORD_TRACKER_STYLE,
    [VARIABLES.APP.SECTION_TRACKER]: DEFAULT_VALUES.APP.SECTIONS_TRACKER,
    [VARIABLES.APP.MINI_PLAYER]: DEFAULT_VALUES.APP.MINI_PLAYER,
    [VARIABLES.APP.SKIP_DEAD_SECTIONS]: DEFAULT_VALUES.APP.SKIP_DEAD_SECTIONS,
    [VARIABLES.APP.SERVICE_REGION]: DEFAULT_VALUES.APP.SERVICE_REGION,
    [VARIABLES.APP.SERVICE_KEY]: DEFAULT_VALUES.APP.SERVICE_KEY,
    [VARIABLES.APP.AUTOSCROLL]: DEFAULT_VALUES.APP.AUTOSCROLL,
    [VARIABLES.APP.HIGHLIGHT_COLOR]: DEFAULT_VALUES.APP.HIGHLIGHT_COLOR,
    [VARIABLES.APP.HIGHLIGHT_STYLE]: DEFAULT_VALUES.APP.HIGHLIGHT_STYLE,
    [VARIABLES.APP.ACTIVE_TAB]: DEFAULT_VALUES.APP.ACTIVE_TAB,
    [VARIABLES.APP.ROUTE]: DEFAULT_VALUES.APP.ROUTE,
    [VARIABLES.APP.ROUTE_TAB]: DEFAULT_VALUES.APP.ROUTE_TAB,
    [VARIABLES.APP.CREDITS]: DEFAULT_VALUES.APP.CREDITS,
    [VARIABLES.APP.CREDITS_RESET_TIMER]: DEFAULT_VALUES.APP.CREDITS_RESET_TIMER,
    [VARIABLES.APP.SKIP_UNTIL_Y]: DEFAULT_VALUES.APP.SKIP_UNTIL_Y,
    [VARIABLES.APP.LANGUAGE]: DEFAULT_VALUES.APP.LANGUAGE,
    [VARIABLES.APP.SCHOLAR_MODE]: DEFAULT_VALUES.APP.SCHOLAR_MODE,
  },
  notification: {
    [VARIABLES.NOTIFICATION.TYPE]: DEFAULT_VALUES.NOTIFICATION.TYPE,
    [VARIABLES.NOTIFICATION.TEXT]: DEFAULT_VALUES.NOTIFICATION.TEXT,
  },
  settings: {
    [VARIABLES.SETTINGS.VISIBLE]: DEFAULT_VALUES.SETTINGS.VISIBLE,
    [VARIABLES.SETTINGS.VOLUME]: DEFAULT_VALUES.SETTINGS.VOLUME,
    [VARIABLES.SETTINGS.PITCH]: DEFAULT_VALUES.SETTINGS.PITCH,
    [VARIABLES.SETTINGS.RATE]: DEFAULT_VALUES.SETTINGS.RATE,
    [VARIABLES.SETTINGS.VOICE]: DEFAULT_VALUES.SETTINGS.VOICE,
    [VARIABLES.SETTINGS.NEURAL_VOICES]: DEFAULT_VALUES.SETTINGS.NEURAL_VOICES,
    [VARIABLES.SETTINGS.VOICES]: DEFAULT_VALUES.SETTINGS.VOICES,
  },
  player: {
    [VARIABLES.PLAYER.SECTIONS]: DEFAULT_VALUES.PLAYER.SECTIONS,
    [VARIABLES.PLAYER.KEY]: DEFAULT_VALUES.PLAYER.KEY,
    [VARIABLES.PLAYER.STATUS]: DEFAULT_VALUES.PLAYER.STATUS,
    [VARIABLES.PLAYER.TAB]: DEFAULT_VALUES.PLAYER.TAB,
    [VARIABLES.PLAYER.BUFFERING]: DEFAULT_VALUES.PLAYER.BUFFERING,
  },

  hotkeys: {
    [VARIABLES.HOTKEYS.DISABLE]: DEFAULT_VALUES.HOTKEYS.DISABLE,
    [VARIABLES.HOTKEYS.START]: DEFAULT_VALUES.HOTKEYS.START,
    [VARIABLES.HOTKEYS.PLAY]: DEFAULT_VALUES.HOTKEYS.PLAY,
    [VARIABLES.HOTKEYS.NEXT]: DEFAULT_VALUES.HOTKEYS.NEXT,
    [VARIABLES.HOTKEYS.PREV]: DEFAULT_VALUES.HOTKEYS.PREV,
    [VARIABLES.HOTKEYS.STOP]: DEFAULT_VALUES.HOTKEYS.STOP,
  },
};
