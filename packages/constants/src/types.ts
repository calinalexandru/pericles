import { PARSER_TYPES, } from './parserTypes';
import { PLAYER_STATUS, } from './playerStatus';
import { RoutesTypes, } from './routes';
import { SectionHighlightStylesTypes, } from './sectionHighlightStyles';
import { TabsTypes, } from './tabs';
import { WordTrackerStylesTypes, } from './wordTrackerStyles';

export type SettingKeys = 'volume' | 'pitch' | 'rate' | 'voice';
export type Settings = {
  [K in SettingKeys]?: number;
};

export type SectionType = {
  node?: Element | HTMLElement | Text;
  encoded?: string;
  pos?: { top: number; width: number; height: number };
  text: string;
};

export type PlayerSectionsType = {
  text: string;
  pos: {
    top: number;
    width: number;
    height: number;
  };
};

export type ParserIframesType = {
  [key: string]: {
    top: number;
    parsing: boolean;
  };
};

export type ParserTypes = typeof PARSER_TYPES[keyof typeof PARSER_TYPES];

export type VoiceType = {
  text: string;
};

export type PlayerStatusTypes =
  typeof PLAYER_STATUS[keyof typeof PLAYER_STATUS];

export type KeyCombo = {
  key: string;
  code: string;
};

export type Range = {
  MIN: number;
  MAX: number;
  STEP: number;
};

export type ThemeModeTypes = 'light' | 'dark';

export type Variables = {
  PARSER: {
    KEY: number;
    END: boolean;
    TYPE: ParserTypes;
    IFRAMES: ParserIframesType;
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
    THEME_MODE: ThemeModeTypes;
    WORD_TRACKER: boolean;
    WORD_TRACKER_STYLE: WordTrackerStylesTypes;
    WORD_TRACKER_COLOR: string;
    SECTIONS_TRACKER: boolean;
    MINI_PLAYER: boolean;
    SKIP_DEAD_SECTIONS: boolean;
    AUTOSCROLL: boolean;
    HIGHLIGHT_COLOR: string;
    HIGHLIGHT_STYLE: SectionHighlightStylesTypes;
    ACTIVE_TAB: number;
    ROUTE: RoutesTypes;
    ROUTE_TAB: TabsTypes;
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
    VOICES: VoiceType[];
  };

  PLAYER: {
    SECTIONS: PlayerSectionsType[];
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
