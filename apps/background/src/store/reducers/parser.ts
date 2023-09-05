import { handleActions, } from 'redux-actions';

import {
  PageActionTypes,
  ParserActionTypes,
  ParserState,
  initialState,
} from '@pericles/store';

const { parser: defaultValues, } = initialState;

export default handleActions<ParserState, Partial<ParserState>>(
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
    [PageActionTypes.SET]: (state, { payload, }: { payload: any }) => {
      console.log('page.set', state, payload);
      return {
        ...state,
        page: payload,
      };
    },
  },
  defaultValues
);
