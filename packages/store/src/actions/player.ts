import { createAction, } from '@reduxjs/toolkit';

import { ParserIframesType, } from '@pericles/constants';

import { PlayerState, } from '../initialState';

import { createAsyncActions, } from './factories';

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
