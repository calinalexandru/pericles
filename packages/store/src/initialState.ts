import { DEFAULT_VALUES, } from '@pericles/constants';

export type ParserState = {
  key: typeof DEFAULT_VALUES.PARSER.KEY;
  end: typeof DEFAULT_VALUES.PARSER.END;
  type: typeof DEFAULT_VALUES.PARSER.TYPE;
  page: typeof DEFAULT_VALUES.PARSER.PAGE;
  maxPage: typeof DEFAULT_VALUES.PARSER.MAX_PAGE;
  iframes: typeof DEFAULT_VALUES.PARSER.IFRAMES;
};

export type AppState = {
  selectedText: typeof DEFAULT_VALUES.APP.SELECTED_TEXT;
  themeMode: typeof DEFAULT_VALUES.APP.THEME_MODE;
  wordTracker: typeof DEFAULT_VALUES.APP.WORD_TRACKER;
  wordTrackerColor: typeof DEFAULT_VALUES.APP.WORD_TRACKER_COLOR;
  wordTrackerStyle: typeof DEFAULT_VALUES.APP.WORD_TRACKER_STYLE;
  sectionTracker: typeof DEFAULT_VALUES.APP.SECTIONS_TRACKER;
  miniPlayer: typeof DEFAULT_VALUES.APP.MINI_PLAYER;
  skipDeadSections: typeof DEFAULT_VALUES.APP.SKIP_DEAD_SECTIONS;
  autoscroll: typeof DEFAULT_VALUES.APP.AUTOSCROLL;
  highlightColor: typeof DEFAULT_VALUES.APP.HIGHLIGHT_COLOR;
  highlightStyle: typeof DEFAULT_VALUES.APP.HIGHLIGHT_STYLE;
  activeTab: typeof DEFAULT_VALUES.APP.ACTIVE_TAB;
  route: typeof DEFAULT_VALUES.APP.ROUTE;
  routeTab: typeof DEFAULT_VALUES.APP.ROUTE_TAB;
  skipUntilY: typeof DEFAULT_VALUES.APP.SKIP_UNTIL_Y;
  language: typeof DEFAULT_VALUES.APP.LANGUAGE;
};

export type NotificationState = {
  type: typeof DEFAULT_VALUES.NOTIFICATION.TYPE;
  text: typeof DEFAULT_VALUES.NOTIFICATION.TEXT;
};

export type SettingsState = {
  visible: typeof DEFAULT_VALUES.SETTINGS.VISIBLE;
  volume: typeof DEFAULT_VALUES.SETTINGS.VOLUME;
  pitch: typeof DEFAULT_VALUES.SETTINGS.PITCH;
  rate: typeof DEFAULT_VALUES.SETTINGS.RATE;
  voice: typeof DEFAULT_VALUES.SETTINGS.VOICE;
  voices: typeof DEFAULT_VALUES.SETTINGS.VOICES;
};

export type PlayerState = {
  sections: typeof DEFAULT_VALUES.PLAYER.SECTIONS;
  key: typeof DEFAULT_VALUES.PLAYER.KEY;
  status: typeof DEFAULT_VALUES.PLAYER.STATUS;
  tab: typeof DEFAULT_VALUES.PLAYER.TAB;
  buffering: typeof DEFAULT_VALUES.PLAYER.BUFFERING;
};

export type HotkeysState = {
  disable: typeof DEFAULT_VALUES.HOTKEYS.DISABLE;
  start: typeof DEFAULT_VALUES.HOTKEYS.START;
  play: typeof DEFAULT_VALUES.HOTKEYS.PLAY;
  next: typeof DEFAULT_VALUES.HOTKEYS.NEXT;
  prev: typeof DEFAULT_VALUES.HOTKEYS.PREV;
  stop: typeof DEFAULT_VALUES.HOTKEYS.STOP;
};

export type RootState = {
  parser: ParserState;
  app: AppState;
  notification: NotificationState;
  settings: SettingsState;
  player: PlayerState;
  hotkeys: HotkeysState;
};

export const initialState: RootState = {
  parser: {
    key: DEFAULT_VALUES.PARSER.KEY,
    end: DEFAULT_VALUES.PARSER.END,
    type: DEFAULT_VALUES.PARSER.TYPE,
    page: DEFAULT_VALUES.PARSER.PAGE,
    maxPage: DEFAULT_VALUES.PARSER.MAX_PAGE,
    iframes: DEFAULT_VALUES.PARSER.IFRAMES,
  },
  app: {
    selectedText: DEFAULT_VALUES.APP.SELECTED_TEXT,
    themeMode: DEFAULT_VALUES.APP.THEME_MODE,
    wordTracker: DEFAULT_VALUES.APP.WORD_TRACKER,
    wordTrackerColor: DEFAULT_VALUES.APP.WORD_TRACKER_COLOR,
    wordTrackerStyle: DEFAULT_VALUES.APP.WORD_TRACKER_STYLE,
    sectionTracker: DEFAULT_VALUES.APP.SECTIONS_TRACKER,
    miniPlayer: DEFAULT_VALUES.APP.MINI_PLAYER,
    skipDeadSections: DEFAULT_VALUES.APP.SKIP_DEAD_SECTIONS,
    autoscroll: DEFAULT_VALUES.APP.AUTOSCROLL,
    highlightColor: DEFAULT_VALUES.APP.HIGHLIGHT_COLOR,
    highlightStyle: DEFAULT_VALUES.APP.HIGHLIGHT_STYLE,
    activeTab: DEFAULT_VALUES.APP.ACTIVE_TAB,
    route: DEFAULT_VALUES.APP.ROUTE,
    routeTab: DEFAULT_VALUES.APP.ROUTE_TAB,
    skipUntilY: DEFAULT_VALUES.APP.SKIP_UNTIL_Y,
    language: DEFAULT_VALUES.APP.LANGUAGE,
  },
  notification: {
    type: DEFAULT_VALUES.NOTIFICATION.TYPE,
    text: DEFAULT_VALUES.NOTIFICATION.TEXT,
  },
  settings: {
    visible: DEFAULT_VALUES.SETTINGS.VISIBLE,
    volume: DEFAULT_VALUES.SETTINGS.VOLUME,
    pitch: DEFAULT_VALUES.SETTINGS.PITCH,
    rate: DEFAULT_VALUES.SETTINGS.RATE,
    voice: DEFAULT_VALUES.SETTINGS.VOICE,
    voices: DEFAULT_VALUES.SETTINGS.VOICES,
  },
  player: {
    sections: DEFAULT_VALUES.PLAYER.SECTIONS,
    key: DEFAULT_VALUES.PLAYER.KEY,
    status: DEFAULT_VALUES.PLAYER.STATUS,
    tab: DEFAULT_VALUES.PLAYER.TAB,
    buffering: DEFAULT_VALUES.PLAYER.BUFFERING,
  },

  hotkeys: {
    disable: DEFAULT_VALUES.HOTKEYS.DISABLE,
    start: DEFAULT_VALUES.HOTKEYS.START,
    play: DEFAULT_VALUES.HOTKEYS.PLAY,
    next: DEFAULT_VALUES.HOTKEYS.NEXT,
    prev: DEFAULT_VALUES.HOTKEYS.PREV,
    stop: DEFAULT_VALUES.HOTKEYS.STOP,
  },
};
