/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider, } from 'react-redux';

import { store as ReduxStore, } from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

import App from './App';

// Starts the connection
const port = getBrowserAPI().api.runtime.connect({ name: 'POPUP', });
port.postMessage({ type: 'POPUP_READY', });

const initPopup = () => {
  const store = ReduxStore.createStore();
  store.ready().then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
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
