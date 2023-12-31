import { createStore, applyMiddleware, combineReducers, } from 'redux';
import { combineEpics, createEpicMiddleware, } from 'redux-observable';
import thunk from 'redux-thunk';
import { Store, wrapStore, } from 'webext-redux';

import core from '@/core';
import { WEBEXT_PORT, } from '@pericles/constants';
import {
  AllActions,
  RootState,
  appActions,
  appReducer,
  hotkeysReducer,
  initialState,
  notificationReducer,
  parserReducer,
  playerReducer,
  settingsReducer,
  store,
} from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

import appEpic from './store/epics/app';
import notificationEpic from './store/epics/notification';
import playerEpic from './store/epics/player';
import settingsEpic from './store/epics/settings';

// Since we are in a service worker, this is not persistent
// and this will be reset to false, as expected, whenever
// the service worker wakes up from idle.
let isInitialized: boolean = false;

const init = async (preloadedState: RootState): Promise<void | Error> => {
  console.log('preloadedState', preloadedState);
  const observableMiddleware = createEpicMiddleware<
    AllActions,
    AllActions,
    RootState
  >();
  store.initialize(
    createStore(
      combineReducers({
        app: appReducer,
        player: playerReducer,
        settings: settingsReducer,
        parser: parserReducer,
        notification: notificationReducer,
        hotkeys: hotkeysReducer,
      }),
      preloadedState,
      applyMiddleware(observableMiddleware, thunk)
    ) as any
  );
  wrapStore(store.current as Store, { portName: WEBEXT_PORT, });
  observableMiddleware.run(
    combineEpics(playerEpic, appEpic, settingsEpic, notificationEpic)
  );
  core();

  store.subscribe(() => {
    getBrowserAPI().api.storage.local.set({ state: store.getState(), });
    console.log('store updated', store.getState());
  });

  return new Promise((resolve, reject) => {
    try {
      getBrowserAPI().api.tabs.query(
        { active: true, currentWindow: true, },
        (tabs: chrome.tabs.Tab[]) => {
          const activeTab = tabs[0];
          const activeTabId = activeTab.id;

          console.log('dispatch tabId', activeTabId);
          store.dispatch(appActions.set({ activeTab: activeTabId, }));
          resolve();
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

type MessageType = {
  type: string;
};

// Listens for incomming connections from content
// scripts, or from the popup. This will be triggered
// whenever the extension "wakes up" from idle.
getBrowserAPI().api.runtime.onConnect.addListener((port) => {
  if ([ 'POPUP', 'CONTENT', ].includes(port.name)) {
    console.log('Connection established:', port.name);

    // Listen for messages on this port.
    port.onMessage.addListener((msg: MessageType) => {
      if ([ 'CONTENT_READY', 'POPUP_READY', ].includes(msg.type)) {
        getBrowserAPI().api.storage.local.get('state', async (storage) => {
          console.log('Fetching state:', { storage, isInitialized, store, });
          if (!isInitialized) {
            await init(storage.state || initialState);
            isInitialized = true;
          }
          port.postMessage({ type: 'STORE_INITIALIZED', });
        });
      }
    });
  }
});
