import { combineEpics, createEpicMiddleware, } from 'redux-observable';
import thunk from 'redux-thunk';
import { applyMiddleware, } from 'webext-redux';

import {
  AllActions, appActions, RootState, store, 
} from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

import appEpic from '../store/epics/app';
import parserEpic from '../store/epics/parser/parser';

import api from './api';
import controller from './controller';
import hotkeys from './hotkeys';
import { InlinePlayer, } from './InlinePlayer';

let initialized = false;
export default (): void => {
  console.log('function initz', initialized, { store, });
  const port = getBrowserAPI().api.runtime.connect({ name: 'CONTENT', });
  port.postMessage({ type: 'CONTENT_READY', });

  const init = (): void => {
    console.log('init content');
    initialized = true;
    const rootEpic = combineEpics(parserEpic, appEpic);
    const observableMiddleware = createEpicMiddleware<
      AllActions,
      AllActions,
      RootState
    >();
    store.initialize(
      applyMiddleware(store.createStore(), thunk, observableMiddleware)
    );
    observableMiddleware.run(rootEpic);

    api();
    controller();
    InlinePlayer();

    if (window === window.top) {
      hotkeys();
    }

    setTimeout(() => {
      store.dispatch(appActions.newContent());
    }, 50);

    store.subscribe(() => {
      const state = store.getState();
      console.log('content.state', state);
    });
  };

  // Listens for when the store gets initialized
  port.onMessage.addListener((msg) => {
    if (msg.type === 'STORE_INITIALIZED' && !initialized) {
      console.log('store initialized - content');
      init();
    }
  });
};
