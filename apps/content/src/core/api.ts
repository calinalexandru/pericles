import { Action, } from 'redux';
import { fromEventPattern, Observable, } from 'rxjs';
import { map, } from 'rxjs/operators';

import { store, } from '@pericles/store';
import { getBrowserAPI, } from '@pericles/util';

import { MaybeAction, MessageRequest, } from '../interfaces/api';

const { api, } = getBrowserAPI();

const isValidAction = (action: MaybeAction) => action?.type && action?.payload;

export default (): void => {
  const onMessage$: Observable<any> = fromEventPattern(
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
    })
  );

  onMessage$.subscribe((action: MaybeAction) => {
    console.log('subscribe.api/action', action);
    if (isValidAction(action)) {
      const validatedAction: Action = action as unknown as Action;
      store.dispatch(validatedAction);
    } else {
      console.warn('Invalid action attemtped', action);
    }
  });
};
