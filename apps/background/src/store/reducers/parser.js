import { handleActions, } from 'redux-actions';

import { PageTypes, ParserTypes, initialState,  } from '@pericles/store';

const { parser: defaultValues, } = initialState;

export default handleActions(
  {
    [ParserTypes.SET]: (state, { payload, }) => {
      console.log('parser.set', state, payload);
      return {
        ...state,
        ...payload,
      };
    },
    [ParserTypes.RESET]: () => ({
      ...defaultValues,
    }),
    [PageTypes.SET]: (state, { payload, }) => {
      console.log('page.set', state, payload);
      return {
        ...state,
        page: payload.value,
      };
    },
  },
  defaultValues
);
