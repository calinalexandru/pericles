import { PayloadAction, createSlice, } from '@reduxjs/toolkit';

import { initialState, } from '../initialState';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState.notification,
  reducers: {
    error: (notificationState, action: PayloadAction<string>) => {
      notificationState.type = 'error';
      notificationState.text = action.payload;
    },
    warning: (notificationState, action: PayloadAction<string>) => {
      notificationState.type = 'warning';
      notificationState.text = action.payload;
    },
    info: (notificationState, action: PayloadAction<string>) => {
      notificationState.type = 'info';
      notificationState.text = action.payload;
    },
    success: (notificationState, action: PayloadAction<string>) => {
      notificationState.type = 'success';
      notificationState.text = action.payload;
    },
    clear: (notificationState) => {
      Object.assign(notificationState, initialState.notification);
    },
  },
});

export const { actions: notificationActions, reducer: notificationReducer, } =
  notificationSlice;
