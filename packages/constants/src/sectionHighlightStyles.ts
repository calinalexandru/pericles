// actual class names found in content/index.css
export const SECTION_HIGHLIGHT_STYLES = {
  BACKGROUND: '_pericles_section_highlight_style_background',
  BORDER: '_pericles_section_highlight_style_border',
} as const;
export type SectionHighlightStylesTypes =
  typeof SECTION_HIGHLIGHT_STYLES[keyof typeof SECTION_HIGHLIGHT_STYLES];
