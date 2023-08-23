// /* eslint-disable no-unused-vars */
import { length, } from 'ramda';
import { handleActions, } from 'redux-actions';

import { PLAYER_STATUS, } from '@pericles/constants';
import {
  PlayerActionTypes,
  SectionsActionTypes,
  initialState,
} from '@pericles/store';

const { player: defaultValues, } = initialState;

export default handleActions(
  {
    [PlayerActionTypes.PLAY]: (state) => {
      console.log('player.play.reducer ');
      return {
        ...state,
        status: PLAYER_STATUS.LOADING,
        buffering: true,
      };
    },
    [PlayerActionTypes.DEMAND]: (state) => {
      console.log('player.demand.reducer');
      return {
        ...state,
        status: PLAYER_STATUS.LOADING,
      };
    },
    [PlayerActionTypes.WAIT]: (state) => ({
      ...state,
      status: PLAYER_STATUS.WAITING,
    }),
    [PlayerActionTypes.STOP]: (state) => ({
      ...state,
      key: 0,
      sections: [],
      buffering: false,
      status: PLAYER_STATUS.STOPPED,
    }),
    [PlayerActionTypes.HALT]: (state) => ({
      ...state,
      key: 0,
      sections: [],
      buffering: false,
      status: PLAYER_STATUS.STOPPED,
    }),
    [PlayerActionTypes.SOFT_HALT]: (state) => ({
      ...state,
      buffering: false,
      status: PLAYER_STATUS.STOPPED,
    }),
    [PlayerActionTypes.NEXT]: (state) => {
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
    [PlayerActionTypes.PREV]: (state) => {
      const curKey = state.key;
      const key = curKey > 0 ? curKey - 1 : 0;
      return {
        ...state,
        key,
        status: PLAYER_STATUS.READY,
      };
    },
    [PlayerActionTypes.RESUME]: (state) => ({
      ...state,
      status: PLAYER_STATUS.PLAYING,
    }),
    [PlayerActionTypes.PAUSE]: (state) => ({
      ...state,
      status: PLAYER_STATUS.PAUSED,
    }),
    [PlayerActionTypes.LOADING]: (state) => ({
      ...state,
      status: PLAYER_STATUS.LOADING,
    }),
    [PlayerActionTypes.ERROR]: (state) => ({
      ...state,
      buffering: false,
      status: PLAYER_STATUS.ERROR,
    }),
    [PlayerActionTypes.SET]: (state, { payload, }) => ({
      ...state,
      ...payload,
    }),
    [PlayerActionTypes.RESET]: (_, { payload = {}, } = {}) => ({
      ...defaultValues,
      ...payload,
    }),
    [SectionsActionTypes.SET]: (state, { payload, }) => {
      console.log('sections.set', state, payload);
      return {
        ...state,
        ...payload,
      };
    },
  },
  defaultValues
);
