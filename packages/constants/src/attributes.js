export default {
  CONTEXT_MENU: {
    READ_FROM_HERE: 'pericles-read-from-here',
    READ_SELECTION: 'pericles-read-selection',
  },

  WEBSITE: {
    URL: 'https://getpericles.com/',
    ACCOUNT: 'https://getpericles.com/account',
    FORGOT_PASSWORD: 'https://getpericles.com/forgot-password',
    SIGN_UP: 'https://getpericles.com/sign-up',
    INSTALLED_URL: 'https://getpericles.com/user-guide#start?v=',
    UNINSTALL_URL: 'https://getpericles.com/extension-uninstall?v=',
  },

  AUTOSCROLL: {
    THRESHOLD: 350,
    BOOK_THRESHOLD: 100,
  },

  TAGS: {
    SECTION: 'ps-section',
    RECT: 'rect',
    SENTENCE: 'ps-sentence',
    WORD: 'ps-word',
    ACTIONS: 'ps-actions',
    H1: [ 'H1', ],
    VERBOSE: [ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', ],
    VERBOSE_SIMPLIFIED: [ 'H1', 'P', ],
  },

  ATTRS: {
    SECTION: 'data-section-id',
    WORD: 'data-char-index',
    WORD_AUDIO: 'data-audio-index',
    MINI_PLAYER_CONTAINER: '_pericles_mini_player_container',
    CONTENT_IFRAME: '_pericles_content_iframe',
    ACTION_PREV: '_pericles_action_prev',
    ACTION_NEXT: '_pericles_action_next',
    ACTION_PLAY: '_pericles_action_play',
    ACTION_STOP: '_pericles_action_stop',
    ACTION_ICON: '_pericles_action_icon',
    ACTION_PAUSE: '_pericles_action_pause',
    SECTION_BEFORE: '_pericles_pulse_before',
    PREV_WORD_TRACKER: '_pericles_prev_word_tracker_style_fade',
    SECTION_BACKGROUND: '--pericles-section-background',
    WORD_BACKGROUND: '--pericles-word-background',
  },

  WINDOW: {
    IFRAME_BUFFER: 'periclesIframeBuffer',
    NODE_BUFFER: 'periclesNodeBuffer',
    SENTENCE_BUFFER: 'periclesSentenceBuffer',
  },

  MISC: {
    MIN_TEXT: 2,
    MAX_TEXT: 300,
    AZURE_ID_DECAL: 1000,
    ELEMENT_VISIBILITY_MARGIN: 50,
    FREE_CREDITS: 0,
    PLAY_TIMEOUT: 10000,
    PLAYER_THROTTLE_TIME: 1000,
    SLIDER_DEBOUNCE: 500,
    MAX_RECURSION_STACK_CALL: 6000,
    MIN_SECTIONS: 2,
  },
};
