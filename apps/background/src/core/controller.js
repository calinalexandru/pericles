// /* eslint-disable no-unused-vars */
import { combineLatest, fromEventPattern, } from 'rxjs';
import {
  filter, map, pluck, tap, 
} from 'rxjs/operators';

import { ATTRIBUTES, } from '@pericles/constants';
import { store, appActions, playerActions, } from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

const { app, } = appActions;
const { player, } = playerActions;

export default () => {
  const { api, } = getBrowserAPI();
  api.contextMenus.create({
    id: ATTRIBUTES.CONTEXT_MENU.READ_FROM_HERE,
    title: 'Read from here',
    contexts: [ 'all', ],
  });

  api.contextMenus.create({
    id: ATTRIBUTES.CONTEXT_MENU.READ_SELECTION,
    title: 'Read selection',
    contexts: [ 'selection', ],
  });

  const tabFocus$ = fromEventPattern(
    (handler) => api.tabs.onActivated.addListener(handler),
    (handler) => api.tabs.onActivated.removeListener(handler)
  ).pipe(
    map((tabs) => tabs),
    pluck('tabId'),
    tap((tabId) => {
      console.log('set tab ID', tabId);
      store.dispatch(app.set({ activeTab: tabId, }));
    })
  );

  const contextMenuClick$ = fromEventPattern(
    (handler) => api.contextMenus.onClicked.addListener(handler),
    (handler) => api.contextMenus.onClicked.removeListener(handler)
  ).pipe(
    map(([ info, ]) => info),
    pluck('menuItemId'),
    filter((item) => item === ATTRIBUTES.CONTEXT_MENU.READ_SELECTION),
    tap(() => {
      console.log('reading selection');
      store.dispatch(player.stop());
      store.dispatch(player.demand());
    })
  );

  const contextMenuClick2$ = fromEventPattern(
    (handler) => api.contextMenus.onClicked.addListener(handler),
    (handler) => api.contextMenus.onClicked.removeListener(handler)
  ).pipe(
    map(([ info, ]) => info),
    pluck('menuItemId'),
    filter((item) => item === ATTRIBUTES.CONTEXT_MENU.READ_FROM_HERE),
    tap(() => {
      store.dispatch(player.stop());
      setTimeout(async () => {
        store.dispatch(player.play({ userGenerated: true, fromCursor: true, }));
      }, 500);
    })
  );

  const manifestVersion = api.runtime.getManifest().version;

  api.runtime.setUninstallURL(
    `${ATTRIBUTES.WEBSITE.UNINSTALL_URL}${manifestVersion}`
  );
  api.runtime.onInstalled.addListener(async (details) => {
    if (details && details.reason === 'install') {
      try {
        await api.tabs.create({
          url: `${ATTRIBUTES.WEBSITE.INSTALLED_URL}${manifestVersion}`,
          active: true,
        });
      } catch (e) {
        console.error('browserAPI.tabs.create', e);
      }
    }
  });

  combineLatest([ tabFocus$, contextMenuClick$, contextMenuClick2$, ]).subscribe();
};
