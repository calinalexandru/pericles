import { i18n, } from '@lingui/core';
import { combineEpics, createEpicMiddleware, } from 'redux-observable';
import thunk from 'redux-thunk';
import { Store, applyMiddleware, } from 'webext-redux';

import { DEFAULT_VALUES, MESSAGES, } from '@pericles/constants';
import { appActions, } from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

import store from '../store';
import appEpic from '../store/epics/app';
import parserEpic from '../store/epics/parser';

import api from './api';
import controller from './controller';
import hotkeys from './hotkeys';
// import iframe from './iframe';

const { app, } = appActions;

let initialized = false;
export default () => {
  console.log('function init');
  getBrowserAPI().api.runtime.connect({ name: 'CONTENT', });

  const init = () => {
    console.log('init content');
    initialized = true;
    const rootEpic = combineEpics(parserEpic, appEpic);
    const observableMiddleware = createEpicMiddleware();
    const s = new Store({ portName: 'WEBEXT_REDUX_TEST', });
    store.current = applyMiddleware(s, thunk, observableMiddleware);
    observableMiddleware.run(rootEpic);

    api();
    controller();
    // iframe();

    if (window === window.top) {
      hotkeys();
    }
    setTimeout(async () => {
      await store.current.dispatch(
        app.newContent({ iframe: window !== window.top, })
      );
    }, 50);

    console.log('content.store', store);

    store.current.subscribe(() => {
      const state = store.current.getState();
      console.log('content.state', state);
    });

    i18n.load(MESSAGES);
    i18n.activate(DEFAULT_VALUES.APP.LANGUAGE);
  };

  // Listens for when the store gets initialized
  getBrowserAPI().api.runtime.onMessage.addListener((req) => {
    console.log('messaged recieved boss', req);
    if (req.action === 'storeReady' && !initialized) {
      console.log('store initialized boss');
      init();
    }
  });
};
