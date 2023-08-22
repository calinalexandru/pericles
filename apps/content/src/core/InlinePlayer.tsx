import React from 'react';
import reactDom from 'react-dom';
import { Provider, } from 'react-redux';

import MiniPlayer from '@/features/MiniPlayer';
import miniPlayerInject from '@/util/miniPlayerInject';
import { store, } from '@pericles/store';

export const InlinePlayer = (): void => {
  store.current.ready().then(() => {
    reactDom.render(
      <Provider store={store.current}>
        <MiniPlayer />
      </Provider>,
      miniPlayerInject()
    );
  });
};
