import { PayloadAction, createSlice, } from '@reduxjs/toolkit';

import {
  PLAYER_STATUS,
  ParserIframesType,
  PlayerSectionsType,
} from '@pericles/constants';

import { PlayerState, initialState, } from '../initialState';

export type PlayPayloadType = {
  iframe?: boolean;
  iframes?: ParserIframesType;
  userGenerated?: boolean;
  fromCursor?: boolean;
  tab?: number;
};

const playerSlice = createSlice({
  name: 'player',
  initialState: initialState.player,
  reducers: {
    set: (playerState, action: PayloadAction<Partial<PlayerState>>) => {
      Object.assign(playerState, action.payload);
    },
    reset: (playerState, action: PayloadAction<Partial<PlayerState>>) => {
      Object.assign(playerState, { ...initialState.player, ...action.payload, });
    },
    play: (playerState, action: PayloadAction<PlayPayloadType>) => {
      console.log('player.play', action);
      playerState.buffering = true;
      playerState.status = PLAYER_STATUS.LOADING;
    },
    demand: (playerState) => {
      playerState.status = PLAYER_STATUS.LOADING;
    },
    wait: (playerState) => {
      playerState.status = PLAYER_STATUS.WAITING;
    },
    stop: (playerState) => {
      playerState.key = 0;
      playerState.sections = [];
      playerState.buffering = false;
      playerState.status = PLAYER_STATUS.STOPPED;
    },
    halt: (playerState) => {
      playerState.key = 0;
      playerState.sections = [];
      playerState.buffering = false;
      playerState.status = PLAYER_STATUS.STOPPED;
    },
    softHalt: (playerState) => {
      playerState.buffering = false;
      playerState.status = PLAYER_STATUS.STOPPED;
    },
    loading: (playerState) => {
      playerState.status = PLAYER_STATUS.LOADING;
    },
    resume: (playerState) => {
      playerState.status = PLAYER_STATUS.PLAYING;
    },
    pause: (playerState) => {
      playerState.status = PLAYER_STATUS.READY;
    },
    error: (playerState) => {
      playerState.buffering = false;
      playerState.status = PLAYER_STATUS.ERROR;
    },
    setSections: (playerState, action: PayloadAction<PlayerSectionsType[]>) => {
      console.log('setSections', action.payload);
      playerState.sections = action.payload;
    },
    next: (playerState, action: PayloadAction<{ auto: boolean }>) => {
      const curKey = playerState.key;
      const sectionsLen = playerState.sections.length - 1;
      const key = sectionsLen <= curKey ? sectionsLen : curKey + 1;
      console.log('player.next.key', key, action);
      playerState.key = key;
      playerState.status = PLAYER_STATUS.READY;
    },
    prev: (playerState, action: PayloadAction<{ auto: boolean }>) => {
      const curKey = playerState.key;
      const key = curKey > 0 ? curKey - 1 : 0;
      console.log('player.prev.key', key, action);
      playerState.key = key;
      playerState.status = PLAYER_STATUS.READY;
    },

    // side effect actions
    end: (
      playerState,
      _action: PayloadAction<{ iframes: ParserIframesType }>
    ) => playerState,
    toggle: (playerState) => playerState,
    timeout: (playerState) => playerState,
    prevSlow: (playerState) => playerState,
    prevMove: (playerState) => playerState,
    softPrev: (playerState) => playerState,
    nextSlow: (playerState) => playerState,
    nextMove: (playerState) => playerState,
    nextAuto: (playerState) => playerState,
    softNext: (playerState) => playerState,
    crash: (playerState, _action: PayloadAction<string>) => playerState,
    idle: (playerState) => playerState,
    proxySectionsRequestAndPlay: (
      playerState,
      _action: PayloadAction<PlayPayloadType>
    ) => playerState,
    proxyResetAndRequestPlay: (
      playerState,
      _action: PayloadAction<PlayPayloadType>
    ) => playerState,
    sectionsRequestAndPlay: (
      playerState,
      _action: PayloadAction<PlayPayloadType>
    ) => playerState,
    proxyPlay: (playerState, _action: PayloadAction<{ tab: number }>) =>
      playerState,
  },
});

export const { actions: playerActions, reducer: playerReducer, } = playerSlice;
