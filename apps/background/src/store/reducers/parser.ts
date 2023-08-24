import { handleActions, Action, } from 'redux-actions';

import {
  PageActionTypes,
  ParserActionTypes,
  ParserState,
  initialState,
} from '@pericles/store';

const { parser: defaultValues, } = initialState;

export default handleActions<ParserState, Action<Partial<ParserState>>>(
  {
    [ParserActionTypes.SET]: (state, { payload, }) => {
      console.log('parser.set', state, payload);
      return {
        ...state,
        ...payload,
      };
    },
    [ParserActionTypes.RESET]: () => ({
      ...defaultValues,
    }),
    [PageActionTypes.SET]: (state, { payload, }) => {
      console.log('page.set', state, payload);
      return {
        ...state,
        page: payload.value,
      };
    },
  },
  defaultValues
);
