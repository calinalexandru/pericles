export const TABS = {
  SETTINGS: 0,
  TWEAKS: 1,
  HOTKEYS: 2,
  MISC: 3,
} as const;
export type TabsTypes = typeof TABS[keyof typeof TABS];
