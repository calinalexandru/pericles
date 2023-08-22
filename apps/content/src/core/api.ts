import { fromEventPattern, Observable, } from 'rxjs';
import { map, tap, } from 'rxjs/operators';

import { store, } from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

import { Action, MessageRequest, } from '../interfaces/api';

const { api, } = getBrowserAPI();

export default (): void => {
  const onMessage$: Observable<Action> = fromEventPattern(
    (handler: any) => api.runtime.onMessage.addListener(handler),
    (handler: any) => api.runtime.onMessage.removeListener(handler)
  ).pipe(
    map(([ request, ]: [MessageRequest]) => {
      console.log('api/action/request', request);
      return {
        ...(request.message || {}),
        payload: {
          ...(request?.message?.payload || {}),
          ...(request.activeTab && { tab: request.activeTab.id, }),
          iframe: window !== window.top,
        },
      };
    }),
    tap((action: Action) => {
      console.log('api/action', action);
      // store.dispatch(action);
    })
  );

  onMessage$.subscribe((action: Action) => {
    console.log('subscribe.api/action', action);
    store.dispatch(action);
  });
};
