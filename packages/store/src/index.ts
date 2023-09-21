import { Epic, } from 'redux-observable';

import { RootState, } from './initialState';
import { appActions, } from './reducers/app';
import { hotkeysActions, } from './reducers/hotkeys';
import { notificationActions, } from './reducers/notification';
import { parserActions, } from './reducers/parser';
import { playerActions, } from './reducers/player';
import { settingsActions, } from './reducers/settings';

export { default as combineAnyEpics, } from './combineAnyEpics';

/* slices */
export * from './reducers/app';
export * from './reducers/hotkeys';
export * from './reducers/notification';
export * from './reducers/parser';
export * from './reducers/settings';
export * from './reducers/player';

type AppActions = ReturnType<typeof appActions[keyof typeof appActions]>;
type HotkeysActions = ReturnType<
  typeof hotkeysActions[keyof typeof hotkeysActions]
>;
type NotificationActions = ReturnType<
  typeof notificationActions[keyof typeof notificationActions]
>;
type ParserActions = ReturnType<
  typeof parserActions[keyof typeof parserActions]
>;
type PlayerActions = ReturnType<
  typeof playerActions[keyof typeof playerActions]
>;
type SettingsActions = ReturnType<
  typeof settingsActions[keyof typeof settingsActions]
>;

export type AllActions =
  | PlayerActions
  | AppActions
  | HotkeysActions
  | NotificationActions
  | ParserActions
  | SettingsActions;

export type EpicFunction = Epic<AllActions, AllActions, RootState>;

/* app */
export { default as appSelector, } from './selectors/app/appSelector';
export { default as appHighlightColorSelector, } from './selectors/app/appHighlightColorSelector';
export { default as appHighlightStyleSelector, } from './selectors/app/appHighlightStyleSelector';
export { default as appSelectedTextSelector, } from './selectors/app/appSelectedTextSelector';
export { default as appAutoscrollSelector, } from './selectors/app/appAutoscrollSelector';
export { default as appActiveTabSelector, } from './selectors/app/appActiveTabSelector';
export { default as appRouteSelector, } from './selectors/app/appRouteSelector';
export { default as appRouteTabSelector, } from './selectors/app/appRouteTabSelector';
export { default as appSkipDeadSectionsSelector, } from './selectors/app/appSkipDeadSectionsSelector';
export { default as appWordTrackerSelector, } from './selectors/app/appWordTrackerSelector';
export { default as appWordTrackerStyleSelector, } from './selectors/app/appWordTrackerStyleSelector';
export { default as appWordTrackerColorSelector, } from './selectors/app/appWordTrackerColorSelector';
export { default as appSectionTrackerSelector, } from './selectors/app/appSectionTrackerSelector';
export { default as appThemeModeSelector, } from './selectors/app/appThemeModeSelector';
export { default as appMiniPlayerSelector, } from './selectors/app/appMiniPlayerSelector';
export { default as appSkipUntilYSelector, } from './selectors/app/appSkipUntilYSelector';
export { default as appLanguageSelector, } from './selectors/app/appLanguageSelector';

/* hotkeys */
export { default as hotkeysSelector, } from './selectors/hotkeys/hotkeysSelector';
export { default as hotkeysDisableSelector, } from './selectors/hotkeys/hotkeysDisableSelector';
export { default as hotkeysStartSelector, } from './selectors/hotkeys/hotkeysStartSelector';
export { default as hotkeysStopSelector, } from './selectors/hotkeys/hotkeysStopSelector';
export { default as hotkeysPlaySelector, } from './selectors/hotkeys/hotkeysPlaySelector';
export { default as hotkeysNextSelector, } from './selectors/hotkeys/hotkeysNextSelector';
export { default as hotkeysPrevSelector, } from './selectors/hotkeys/hotkeysPrevSelector';

/* notification */
export { default as notificationSelector, } from './selectors/notification/notificationSelector';
export { default as notificationTextSelector, } from './selectors/notification/notificationTextSelector';
export { default as notificationTypeSelector, } from './selectors/notification/notificationTypeSelector';

/* parser */
export { default as parserSelector, } from './selectors/parser/parserSelector';
export { default as parserKeySelector, } from './selectors/parser/parserKeySelector';
export { default as parserEndSelector, } from './selectors/parser/parserEndSelector';
export { default as parserPageSelector, } from './selectors/parser/parserPageSelector';
export { default as parserTypeSelector, } from './selectors/parser/parserTypeSelector';
export { default as parserMaxPageSelector, } from './selectors/parser/parserMaxPageSelector';
export { default as parserIframesSelector, } from './selectors/parser/parserIframesSelector';

/* player */
export { default as playerSelector, } from './selectors/player/playerSelector';
export { default as playerSectionsSelector, } from './selectors/player/playerSectionsSelector';
export { default as playerKeySelector, } from './selectors/player/playerKeySelector';
export { default as playerTabSelector, } from './selectors/player/playerTabSelector';
export { default as playerStatusSelector, } from './selectors/player/playerStatusSelector';
export { default as playerBufferingSelector, } from './selectors/player/playerBufferingSelector';

/* settings */
export { default as settingsSelector, } from './selectors/settings/settingsSelector';
export { default as settingsVisibleSelector, } from './selectors/settings/settingsVisibleSelector';
export { default as settingsVolumeSelector, } from './selectors/settings/settingsVolumeSelector';
export { default as settingsPitchSelector, } from './selectors/settings/settingsPitchSelector';
export { default as settingsRateSelector, } from './selectors/settings/settingsRateSelector';
export { default as settingsVoiceSelector, } from './selectors/settings/settingsVoiceSelector';
export { default as settingsVoicesSelector, } from './selectors/settings/settingsVoicesSelector';

export * from './initialState';

export { default as store, } from './ReduxStore';
