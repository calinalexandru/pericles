// /* eslint-disable no-unused-vars */
import { fromEventPattern, } from 'rxjs';
import { map, tap, } from 'rxjs/operators';

import store from '@/store';
import { getBrowserAPI, } from '@pericles/util';

const { api, } = getBrowserAPI();

export default () => {
  const onMessage$ = fromEventPattern(
    (handler) => api.runtime.onMessage.addListener(handler),
    (handler) => api.runtime.onMessage.removeListener(handler)
  ).pipe(
    map(([ request, ]) => {
      console.log('api/action/request', request);
      const { activeTab, } = request;
      if (activeTab.id && !window.periclesTabId) {
        window.periclesTabId = activeTab.id;
      }
      return {
        ...request.message,
        payload: {
          ...request.message.payload,
          iframe: window !== window.top,
          tab: activeTab.id,
        },
      };
    }),
    tap((action) => {
      console.log('api/action', action);
      // store.dispatch(action);
    })
  );
  onMessage$.subscribe((action) => {
    console.log('subscribe.api/action', action);
    store.current.dispatch(action);
  });
};
