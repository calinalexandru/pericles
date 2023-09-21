import { PayloadAction, createAction, createSlice, } from '@reduxjs/toolkit';

import {
  PLAYER_STATUS,
  ParserIframesType,
  PlayerSectionsType,
} from '@pericles/constants';

import { PlayerState, initialState, } from '../initialState';

export type PlayerPlayParams = {
  userGenerated: boolean;
  fromCursor: boolean;
};

export type PlayPayloadType = {
  iframe?: boolean;
  iframes?: ParserIframesType;
  userGenerated?: boolean;
  fromCursor?: boolean;
  working?: boolean;
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
    play: (playerState, action: PayloadAction<PlayerPlayParams>) => {
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
    prev: (playerState) => {
      const curKey = playerState.key;
      const key = curKey > 0 ? curKey - 1 : 0;
      console.log('player.prev.key', key);
      playerState.key = key;
      playerState.status = PLAYER_STATUS.READY;
    },
  },
});

const sideEffectActions = {
  idle: createAction('player/idle'),
  proxyPlay: createAction<{ tab: number }>('player/proxyPlay'),
  softNext: createAction('player/softNext'),
  nextAuto: createAction('player/nextAuto'),
  nextMove: createAction('player/nextMove'),
  nextSlow: createAction('player/nextSlow'),
  softPrev: createAction('player/softPrev'),
  prevMove: createAction('player/prevMove'),
  prevSlow: createAction('player/prevSlow'),
  crash: createAction<{ message: string }>('player/crash'),
  end: createAction<{ iframes: ParserIframesType }>('player/end'),
  timeout: createAction('player/timeout'),
  toggle: createAction('player/toggle'),
  sectionsRequestAndPlay: createAction<PlayPayloadType>(
    'player/sectionsRequestAndPlay'
  ),
  proxySectionsRequestAndPlay: createAction<PlayPayloadType>(
    'player/proxySectionsRequestAndPlay'
  ),
  proxyResetAndRequestPlay: createAction<PlayPayloadType>(
    'player/proxyResetAndRequestPlay'
  ),
};

const { actions: reducerActions, reducer, } = playerSlice;

export const playerActions = { ...reducerActions, ...sideEffectActions, };
export const playerReducer = reducer;
