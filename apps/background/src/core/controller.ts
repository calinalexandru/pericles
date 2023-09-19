import { combineLatest, fromEventPattern, } from 'rxjs';
import { filter, map, tap, } from 'rxjs/operators';

import { ATTRIBUTES, } from '@pericles/constants';
import {
  store,
  playerStop,
  playerDemand,
  playerPlay,
  appActions,
} from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

export default () => {
  const { api, } = getBrowserAPI();

  api.tabs.onRemoved.addListener((tabId: number, removeInfo) => {
    console.log('tab closed listener', tabId, removeInfo);
    store.dispatch(appActions.tabClosed(tabId));
  });

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

  const tabFocus$ = fromEventPattern<chrome.tabs.TabActiveInfo>(
    (handler) => api.tabs.onActivated.addListener(handler),
    (handler) => api.tabs.onActivated.removeListener(handler)
  ).pipe(
    map((activeInfo) => activeInfo.tabId),
    tap((tabId: number) => {
      console.log('set tab ID', tabId);
      store.dispatch(appActions.set({ activeTab: tabId, }));
    })
  );

  const contextMenuClick$ = fromEventPattern<
    [chrome.contextMenus.OnClickData, chrome.tabs.Tab]
  >(
    (handler) => api.contextMenus.onClicked.addListener(handler),
    (handler) => api.contextMenus.onClicked.removeListener(handler)
  ).pipe(
    map(([ info, ]) => info.menuItemId),
    filter(
      (menuItemId) => menuItemId === ATTRIBUTES.CONTEXT_MENU.READ_SELECTION
    ),
    tap(() => {
      console.log('reading selection');
      store.dispatch(playerStop());
      store.dispatch(playerDemand());
    })
  );

  const contextMenuClick2$ = fromEventPattern<
    [chrome.contextMenus.OnClickData, chrome.tabs.Tab]
  >(
    (handler) => api.contextMenus.onClicked.addListener(handler),
    (handler) => api.contextMenus.onClicked.removeListener(handler)
  ).pipe(
    map(([ info, ]) => info.menuItemId),
    filter(
      (menuItemId) => menuItemId === ATTRIBUTES.CONTEXT_MENU.READ_FROM_HERE
    ),
    tap(() => {
      store.dispatch(playerStop());
      setTimeout(() => {
        store.dispatch(
          playerPlay.request({ userGenerated: true, fromCursor: true, })
        );
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
