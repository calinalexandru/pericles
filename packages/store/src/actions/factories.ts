import { createAction, } from '@reduxjs/toolkit';

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

export function createAsyncActions<
  RequestPayload = void,
  SuccessPayload = void
>(baseAction: string) {
  const actionTypes = createAsyncActionTypes(baseAction);

  return {
    actionTypes,
    idle: createAction(actionTypes.IDLE),
    request: createAction<RequestPayload>(actionTypes.REQUEST),
    success: createAction<SuccessPayload>(actionTypes.SUCCESS),
    failure: createAction<Error>(actionTypes.FAILURE),
  };
}
