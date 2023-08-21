import { fromEventPattern, Observable, } from 'rxjs';
import { NodeEventHandler, } from 'rxjs/internal/observable/fromEvent';
import { map, tap, } from 'rxjs/operators';

import { Action, MessageRequest, } from '@/interfaces/api';
import { store, } from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

const { api, } = getBrowserAPI();

export default (): void => {
  const onMessage$: Observable<Action> = fromEventPattern(
    (handler: NodeEventHandler) => api.runtime.onMessage.addListener(handler),
    (handler: NodeEventHandler) => api.runtime.onMessage.removeListener(handler)
  ).pipe(
    map(([ request, ]: [MessageRequest]) => {
      console.log('api/action/request', request);
      return {
        ...(request.message || {}),
        payload: {
          ...(request?.message?.payload || {}),
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
