import { createStore, applyMiddleware, combineReducers, } from 'redux';
import { combineEpics, createEpicMiddleware, } from 'redux-observable';
import thunk from 'redux-thunk';
import { wrapStore, } from 'webext-redux';

import core from '@/core'
import store from '@/store'
import { getBrowserAPI, } from '@pericles/util';

import appEpic from './store/epics/app';
import hotkeysEpic from './store/epics/hotkeys';
import notificationEpic from './store/epics/notification';
import playerEpic from './store/epics/player';
import settingsEpic from './store/epics/settings';
import appReducer from './store/reducers/app';
import hotkeysReducer from './store/reducers/hotkeys';
import notificationReducer from './store/reducers/notification';
import parserReducer from './store/reducers/parser';
import playerReducer from './store/reducers/player';
import settingsReducer from './store/reducers/settings';

const initialState = {};

// Since we are in a service worker, this is not persistent
// and this will be reset to false, as expected, whenever
// the service worker wakes up from idle.
let isInitialized = false;

const init = (preloadedState) => {
  const observableMiddleware = createEpicMiddleware();
  store.current = createStore(
    combineReducers({
      app: appReducer,
      player: playerReducer,
      settings: settingsReducer,
      parser: parserReducer,
      notification: notificationReducer,
      hotkeys: hotkeysReducer,
      // ...preloadedState,
    }),
    applyMiddleware(observableMiddleware, thunk)
  );
  wrapStore(store.current, { portName: 'WEBEXT_REDUX_TEST', });
  observableMiddleware.run(
    combineEpics(
      playerEpic,
      appEpic,
      settingsEpic,
      hotkeysEpic,
      notificationEpic
    )
  );
  core();

  store.current.subscribe(() => {
    getBrowserAPI().api.storage.local.set({ state: store.current.getState(), });

    console.log('aici subscriem');
  });
};

// Listens for incomming connections from content
// scripts, or from the popup. This will be triggered
// whenever the extension "wakes up" from idle.
getBrowserAPI().api.runtime.onConnect.addListener((port) => {
  if ([ 'POPUP', 'CONTENT', ].includes(port.name)) {
    console.log('the popup was poened, ', port.name);
    // The popup was opened.
    // Gets the current state from the storage.
    getBrowserAPI().api.storage.local.get('state', (storage) => {
      if (!isInitialized) {
        // 1. Initializes the redux store and the message passing.
        init(storage.state || initialState);
        isInitialized = true;
      }
      // 2. Sends a message to notify that the store is ready.
      getBrowserAPI().api.runtime.sendMessage({ type: 'STORE_INITIALIZED', });
    });
    
    if (isInitialized) {
      getBrowserAPI().api.runtime.sendMessage({ type: 'STORE_INITIALIZED', });
    }
  }
});
