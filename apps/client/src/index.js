/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider, } from 'react-redux';
import { I18nProvider, } from '@lingui/react';
import { i18n, } from '@lingui/core';
import { Store, } from 'webext-redux';

import { MESSAGES, DEFAULT_VALUES, WEBEXT_PORT, } from '@pericles/constants';
import { getBrowserAPI, } from '@pericles/util';

import App from './App';

i18n.load(MESSAGES);
i18n.activate(DEFAULT_VALUES.APP.LANGUAGE);

// Starts the connection
const port = getBrowserAPI().api.runtime.connect({ name: 'POPUP', });
port.postMessage({ type: 'POPUP_READY', });

const initPopup = () => {
  const store = new Store({ portName: WEBEXT_PORT, });
  store.ready().then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <App />
        </I18nProvider>
      </Provider>,
      document.getElementById('root')
    );
  });
};

// Listens for when the store gets initialized
port.onMessage.addListener((req) => {
  if (req.type === 'STORE_INITIALIZED') {
    console.log('store initialized boss');
    initPopup();
  }
});
