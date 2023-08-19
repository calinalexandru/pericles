// /* eslint-disable no-unused-vars */
import { length, pathOr, } from 'ramda';
import { handleActions, } from 'redux-actions';

import { PLAYER_STATUS, } from '@pericles/constants';
import { initialState, playerActions, } from '@pericles/store';

const { player, sections, } = playerActions;
const { player: defaultValues, } = initialState;

export default handleActions(
  {
    [player.play]: (state, { payload, }) => {
      console.log('player.play.reducer');
      return {
        ...state,
        tab: pathOr(state.tab, [ 'tab', ], payload),
        status: PLAYER_STATUS.LOADING,
        buffering: true,
      };
    },
    [player.demand]: (state, { payload, }) => {
      console.log('player.demand.reducer');
      return {
        ...state,
        tab: pathOr(state.tab, [ 'tab', ], payload),
        status: PLAYER_STATUS.LOADING,
      };
    },
    [player.wait]: (state) => ({
      ...state,
      status: PLAYER_STATUS.WAITING,
    }),
    [player.stop]: (state) => ({
      ...state,
      key: 0,
      sections: [],
      buffering: false,
      status: PLAYER_STATUS.STOPPED,
    }),
    [player.halt]: (state) => ({
      ...state,
      key: 0,
      sections: [],
      buffering: false,
      status: PLAYER_STATUS.STOPPED,
    }),
    [player.softHalt]: (state) => ({
      ...state,
      buffering: false,
      status: PLAYER_STATUS.STOPPED,
    }),
    [player.next]: (state) => {
      const curKey = state.key;
      const sectionsLen = length(state.sections) - 1;
      const key = sectionsLen <= curKey ? sectionsLen : curKey + 1;
      console.log('player.next.key', key);
      return {
        ...state,
        key,
        status: PLAYER_STATUS.READY,
      };
    },
    [player.prev]: (state) => {
      const curKey = state.key;
      const key = curKey > 0 ? curKey - 1 : 0;
      return {
        ...state,
        key,
        status: PLAYER_STATUS.READY,
      };
    },
    [player.resume]: (state) => ({
      ...state,
      status: PLAYER_STATUS.PLAYING,
    }),
    [player.pause]: (state) => ({
      ...state,
      status: PLAYER_STATUS.PAUSED,
    }),
    [player.loading]: (state) => ({
      ...state,
      status: PLAYER_STATUS.LOADING,
    }),
    [player.ready]: (state) => ({
      ...state,
      status: PLAYER_STATUS.READY,
    }),
    [player.error]: (state) => ({
      ...state,
      buffering: false,
      status: PLAYER_STATUS.ERROR,
    }),
    [player.overload]: (state) => ({
      ...state,
      status: PLAYER_STATUS.OVERLOAD,
    }),
    [player.set]: (state, { payload, }) => ({
      ...state,
      ...payload,
    }),
    [player.reset]: () => ({ ...defaultValues, }),
    [sections.set]: (state, { payload, }) => {
      console.log('sections.set', state, payload);
      return {
        ...state,
        ...payload,
      };
    },
  },
  defaultValues
);
