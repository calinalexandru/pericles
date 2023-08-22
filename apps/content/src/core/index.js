import { i18n, } from '@lingui/core';
import { combineEpics, createEpicMiddleware, } from 'redux-observable';
import thunk from 'redux-thunk';
import { applyMiddleware, } from 'webext-redux';

import { DEFAULT_VALUES, MESSAGES, } from '@pericles/constants';
import { appNewContent, store, } from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

import appEpic from '../store/epics/app';
import parserEpic from '../store/epics/parser';

import api from './api';
import controller from './controller';
import hotkeys from './hotkeys';
import { InlinePlayer, } from './InlinePlayer';

let initialized = false;
export default () => {
  console.log('function initz', initialized, { store, });
  const port = getBrowserAPI().api.runtime.connect({ name: 'CONTENT', });
  port.postMessage({ type: 'CONTENT_READY', });

  const init = () => {
    console.log('init content');
    initialized = true;
    const rootEpic = combineEpics(parserEpic, appEpic);
    const observableMiddleware = createEpicMiddleware();
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
    setTimeout(async () => {
      store.dispatch(appNewContent({ iframe: window !== window.top, }));
    }, 50);

    console.log('content.store', store);

    store.subscribe(() => {
      const state = store.getState();
      console.log('content.state', state);
    });

    i18n.load(MESSAGES);
    i18n.activate(DEFAULT_VALUES.APP.LANGUAGE);
  };

  // Listens for when the store gets initialized
  port.onMessage.addListener((msg) => {
    console.log('port msg', msg);
    if (msg.type === 'STORE_INITIALIZED' && !initialized) {
      console.log('store initialized boss');
      init();
    }
  });
};
