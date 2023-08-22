import { createAction, } from 'redux-actions';

export type AsyncActionStages = 'IDLE' | 'REQUEST' | 'SUCCESS' | 'FAILURE';

export function createAsyncActionTypes(
  baseAction: string
): Record<AsyncActionStages, string> {
  return {
    IDLE: `${baseAction}/IDLE`,
    REQUEST: `${baseAction}/REQUEST`,
    SUCCESS: `${baseAction}/SUCCESS`,
    FAILURE: `${baseAction}/FAILURE`,
  };
}

export function createAsyncActions<Payload = undefined>(baseAction: string) {
  const actionTypes = createAsyncActionTypes(baseAction);

  return {
    idle: createAction(actionTypes.IDLE),
    request: createAction<Payload>(actionTypes.REQUEST),
    success: createAction<Payload>(actionTypes.SUCCESS),
    failure: createAction<Error>(actionTypes.FAILURE),
  };
}
