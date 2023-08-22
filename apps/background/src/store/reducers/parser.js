import { handleActions, } from 'redux-actions';

import {
  PageActionTypes,
  ParserActionTypes,
  initialState,
} from '@pericles/store';

const { parser: defaultValues, } = initialState;

export default handleActions(
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
