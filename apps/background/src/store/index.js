import { createStore, applyMiddleware, combineReducers, } from 'redux';
import { combineEpics, createEpicMiddleware, } from 'redux-observable';
import thunk from 'redux-thunk';
import { wrapStore, } from 'webext-redux';

import appEpic from './epics/app';
import hotkeysEpic from './epics/hotkeys';
import notificationEpic from './epics/notification';
import playerEpic from './epics/player';
import settingsEpic from './epics/settings';
import appReducer from './reducers/app';
import hotkeysReducer from './reducers/hotkeys';
import notificationReducer from './reducers/notification';
import parserReducer from './reducers/parser';
import playerReducer from './reducers/player';
import settingsReducer from './reducers/settings';

const observableMiddleware = createEpicMiddleware();
const store = createStore(
  combineReducers({
    app: appReducer,
    player: playerReducer,
    settings: settingsReducer,
    parser: parserReducer,
    notification: notificationReducer,
    hotkeys: hotkeysReducer,
  }),
  applyMiddleware(observableMiddleware, thunk)
);
wrapStore(store);
observableMiddleware.run(
  combineEpics(playerEpic, appEpic, settingsEpic, hotkeysEpic, notificationEpic)
);

export default store;
