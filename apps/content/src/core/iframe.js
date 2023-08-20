/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import reactDom from 'react-dom';
import { Provider, } from 'react-redux';

import MiniPlayer from '@/features/MiniPlayer';
import miniPlayerInject from '@/util/miniPlayerInject';
import { store, } from '@pericles/store';

export default () => {
  store.ready().then(() =>
    reactDom.render(
      <Provider store={store}>
        <MiniPlayer />
      </Provider>,
      miniPlayerInject()
    )
  );
};
