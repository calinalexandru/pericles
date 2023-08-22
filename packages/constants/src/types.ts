export type ParserTypes =
  | 'default'
  | 'googleDoc'
  | 'googleDocSvg'
  | 'googleForm'
  | 'openBook'
  | 'googleBook'
  | 'grammarlyApp';

export type PlayerStatusTypes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type KeyCombo = {
  key: string;
  code: string;
};

export type Range = {
  MIN: number;
  MAX: number;
  STEP: number;
};

export type Variables = {
  PARSER: {
    KEY: number;
    END: boolean;
    TYPE: ParserTypes;
    IFRAMES: Record<string, any>;
    PAGE: number;
    MAX_PAGE: number;
  };

  AUTH: {
    SUBSCRIPTION: boolean;
    STATUS: boolean;
    TOKEN: string;
    BUFFERING: boolean;
  };

  APP: {
    THEME_MODE: 'light' | 'dark';
    WORD_TRACKER: boolean;
    WORD_TRACKER_STYLE: any;
    WORD_TRACKER_COLOR: string;
    SECTIONS_TRACKER: boolean;
    MINI_PLAYER: boolean;
    SKIP_DEAD_SECTIONS: boolean;
    AUTOSCROLL: boolean;
    HIGHLIGHT_COLOR: string;
    HIGHLIGHT_STYLE: any;
    ACTIVE_TAB: number;
    ROUTE: any;
    ROUTE_TAB: any;
    SKIP_UNTIL_Y: number;
    LANGUAGE: string;
    SELECTED_TEXT: string;
  };

  NOTIFICATION: {
    TYPE: string;
    TEXT: string;
  };

  SETTINGS: {
    PARAMS: {
      VOLUME: Range;
      RATE: Range;
      PITCH: Range;
    };
    VISIBLE: boolean;
    VOLUME: number;
    RATE: number;
    PITCH: number;
    VOICE: number;
    NEURAL_VOICES: string[];
    VOICES: string[];
  };

  PLAYER: {
    SECTIONS: string[];
    KEY: number;
    STATUS: PlayerStatusTypes;
    TAB: number;
    BUFFERING: boolean;
  };

  HOTKEYS: {
    DISABLE: boolean;
    START: KeyCombo[];
    PLAY: KeyCombo[];
    NEXT: KeyCombo[];
    PREV: KeyCombo[];
    STOP: KeyCombo[];
  };
};
