import { createAction, } from '@reduxjs/toolkit';

import { ParserIframesType, } from '@pericles/constants';

import { PlayerState, } from '../initialState';

import {  createAsyncActions, } from './factories';

export enum PlayerActionTypes {
  SET = 'PLAYER/SET',
  PLAY = 'PLAYER/PLAY',
  PROXY_PLAY = 'PLAYER/PROXY_PLAY',
  PAUSE = 'PLAYER/PAUSE',
  RESUME = 'PLAYER/RESUME',
  CONTINUE = 'PLAYER/CONTINUE',
  DEMAND = 'PLAYER/DEMAND',
  STOP = 'PLAYER/STOP',
  SOFT_HALT = 'PLAYER/SOFT_HALT',
  HALT = 'PLAYER/HALT',
  NEXT = 'PLAYER/NEXT',
  SOFT_NEXT = 'PLAYER/SOFT_NEXT',
  NEXT_AUTO = 'PLAYER/NEXT_AUTO',
  NEXT_MOVE = 'PLAYER/NEXT_MOVE',
  NEXT_SLOW = 'PLAYER/NEXT_SLOW',
  PREV = 'PLAYER/PREV',
  PREV_MOVE = 'PLAYER/PREV_MOVE',
  SOFT_PREV = 'PLAYER/SOFT_PREV',
  PREV_SLOW = 'PLAYER/PREV_SLOW',
  WAIT = 'PLAYER/WAIT',
  RESET = 'PLAYER/RESET',
  IDLE = 'PLAYER/IDLE',
  LOADING = 'PLAYER/LOADING',
  CRASH = 'PLAYER/CRASH',
  END = 'PLAYER/END',
  TIMEOUT = 'PLAYER/TIMEOUT',
  TOGGLE = 'PLAYER/TOGGLE',
  ERROR = 'PLAYER/ERROR',
}

export enum SectionsActionTypes {
  SET = 'SECTIONS/SET',
}

type PayloadType = {
  iframe?: boolean;
  iframes?: ParserIframesType;
  userGenerated?: boolean;
  fromCursor?: boolean;
  working?: boolean;
  tab?: number;
};
export const sectionsRequestAndPlay = createAsyncActions<PayloadType>(
  'SECTIONS_REQUEST_AND_PLAY'
);

export const proxySectionsRequestAndPlay = createAsyncActions<any>(
  'PROXY_SECTIONS_REQUEST_AND_PLAY'
);

export const proxyResetAndRequestPlay = createAsyncActions<any>(
  'PROXY_RESET_AND_REQUEST_PLAY'
);

export const setPlayer = createAction<Partial<PlayerState>>(
  PlayerActionTypes.SET
);

export type PlayerPlayParams = {
  userGenerated: boolean;
  fromCursor: boolean;
};

export const playerPlay = createAsyncActions<PlayerPlayParams>(
  PlayerActionTypes.PLAY
);

export const playerProxyPlay = createAction<{ tab: number }>(
  PlayerActionTypes.PROXY_PLAY
);
export const playerPause = createAction(PlayerActionTypes.PAUSE);
export const playerResume = createAction(PlayerActionTypes.RESUME);
export const playerContinue = createAction(PlayerActionTypes.CONTINUE);
export const playerDemand = createAction(PlayerActionTypes.DEMAND);
export const playerStop = createAction(PlayerActionTypes.STOP);
export const playerSoftHalt = createAction(PlayerActionTypes.SOFT_HALT);
export const playerHalt = createAction(PlayerActionTypes.HALT);
export const playerSoftNext = createAction(PlayerActionTypes.SOFT_NEXT);
export const playerNext = createAction<{ auto: boolean }>(
  PlayerActionTypes.NEXT
);
export const playerNextAuto = createAction(PlayerActionTypes.NEXT_AUTO);
export const playerNextMove = createAction(PlayerActionTypes.NEXT_MOVE);
export const playerNextSlow = createAction(PlayerActionTypes.NEXT_SLOW);
export const playerPrev = createAction(PlayerActionTypes.PREV);
export const playerSoftPrev = createAction(PlayerActionTypes.SOFT_PREV);
export const playerPrevMove = createAction(PlayerActionTypes.PREV_MOVE);
export const playerPrevSlow = createAction(PlayerActionTypes.PREV_SLOW);
export const playerWait = createAction(PlayerActionTypes.WAIT);
export const playerReset = createAction<{ tab: number }>(
  PlayerActionTypes.RESET
);
export const playerIdle = createAction(PlayerActionTypes.IDLE);
export const playerCrash = createAction<{ message: string }>(
  PlayerActionTypes.CRASH
);
export const playerEnd = createAction<any>(PlayerActionTypes.END);
export const playerTimeout = createAction(PlayerActionTypes.TIMEOUT);
export const playerToggle = createAction(PlayerActionTypes.TOGGLE);

export const setSections = createAction<any>(SectionsActionTypes.SET);
