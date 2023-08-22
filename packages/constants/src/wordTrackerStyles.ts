// actual class names found in content/index.css
export const WORD_TRACKER_STYLES = {
  UNDERLINE: '_pericles_word_tracker_style_underline',
  BACKGROUND: '_pericles_word_tracker_style_background',
  FADE: '_pericles_word_tracker_style_fade',
} as const;
export type WordTrackerStylesTypes =
  typeof WORD_TRACKER_STYLES[keyof typeof WORD_TRACKER_STYLES];
