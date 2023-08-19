import { handleActions, } from 'redux-actions';

import { initialState, parserActions, } from '@pericles/store';

const { parser, page, } = parserActions;
const { parser: defaultValues, } = initialState;

export default handleActions(
  {
    [parser.set]: (state, { payload, }) => {
      console.log('parser.set', state, payload);
      return {
        ...state,
        ...payload,
      };
    },
    [parser.reset]: () => ({
      ...defaultValues,
    }),
    [page.set]: (state, { payload, }) => {
      console.log('page.set', state, payload);
      return {
        ...state,
        page: payload.value,
      };
    },
  },
  defaultValues
);
