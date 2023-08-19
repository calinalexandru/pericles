/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider, } from 'react-redux';
import { I18nProvider, } from '@lingui/react';
import { i18n, } from '@lingui/core';

import { MESSAGES, DEFAULT_VALUES, } from '@pericles/constants';

import App from './App';
import store from './store';

i18n.load(MESSAGES);
i18n.activate(DEFAULT_VALUES.APP.LANGUAGE);

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
