import { i18n, } from '@lingui/core';

import store from '@/store';
import { DEFAULT_VALUES, MESSAGES, } from '@pericles/constants';
import { appActions, } from '@pericles/store';

import api from './api';
import controller from './controller';
import hotkeys from './hotkeys';
import iframe from './iframe';

const { app, } = appActions;

export default () => {
  api();
  controller();
  iframe();
  if (window === window.top) {
    hotkeys();
  }
  setTimeout(async () => {
    await store.dispatch(app.newContent({ iframe: window !== window.top, }));
  }, 50);
  store.subscribe(() => {
    const state = store.getState();
    console.log('state', state);
  });

  i18n.load(MESSAGES);
  i18n.activate(DEFAULT_VALUES.APP.LANGUAGE);
};
