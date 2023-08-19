import { createActions, } from 'redux-actions';

export default createActions({
  NOTIFICATION: {
    INFO: null,
    ERROR: null,
    WARNING: null,
    SUCCESS: null,
    CLEAR: null,
  },
});
