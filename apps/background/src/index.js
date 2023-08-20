import { createStore, applyMiddleware, combineReducers, } from 'redux';
import { combineEpics, createEpicMiddleware, } from 'redux-observable';
import thunk from 'redux-thunk';
import { wrapStore, } from 'webext-redux';

import core from '@/core';
import { WEBEXT_PORT, } from '@pericles/constants';
import { appActions, store, } from '@pericles/store';
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

const { app, } = appActions;

const init = (preloadedState) => {
  const observableMiddleware = createEpicMiddleware();
  store.initialize(
    createStore(
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
    )
  );
  wrapStore(store.current, { portName: WEBEXT_PORT, });
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

  store.subscribe(() => {
    getBrowserAPI().api.storage.local.set({ state: store.getState(), });
    console.log('store updated', store.getState());
  });

  getBrowserAPI().api.tabs.query(
    { active: true, currentWindow: true, },
    (tabs) => {
      const activeTab = tabs[0];
      const activeTabId = activeTab.id;

      // Dispatch the tab ID to your state here
      console.log('dispatch tabId', activeTabId);
      store.dispatch(app.set({ activeTab: activeTabId, }));
    }
  );
};

// Listens for incomming connections from content
// scripts, or from the popup. This will be triggered
// whenever the extension "wakes up" from idle.
getBrowserAPI().api.runtime.onConnect.addListener((port) => {
  if ([ 'POPUP', 'CONTENT', ].includes(port.name)) {
    console.log('Connection established:', port.name);

    // Listen for messages on this port.
    port.onMessage.addListener((msg) => {
      if ([ 'CONTENT_READY', 'POPUP_READY', ].includes(msg.type)) {
        getBrowserAPI().api.storage.local.get('state', (storage) => {
          console.log('Fetching state:', { storage, isInitialized, store, });
          if (!isInitialized) {
            init(storage.state || initialState);
            isInitialized = true;
          }
          port.postMessage({ type: 'STORE_INITIALIZED', });
        });
      }
    });
  }
});
