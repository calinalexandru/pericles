import { Store, } from 'webext-redux';

import { WEBEXT_PORT, } from '@pericles/constants';

class ReduxStore {

  constructor() {
    this._store = null;
  }

  get current() {
    return this._store;
  }

  createStore() {
    return new Store({ portName: WEBEXT_PORT, });
  }

  initialize(storeInstance) {
    if (!this._store) {
      this._store = storeInstance;
    } else {
      console.warn('Store is already initialized');
    }
  }

  dispatch(action) {
    if (!this._store) {
      console.warn('Store is not initialized yet');
      return;
    }
    this._store.dispatch(action);
  }

  getState() {
    if (!this._store) {
      console.warn('Store is not initialized yet');
      return null;
    }
    return this._store.getState();
  }

  subscribe(listener) {
    if (!this._store) {
      console.warn('Store is not initialized yet');
      return;
    }
    this._store.subscribe(listener);
  }

}

const reduxStoreInstance = new ReduxStore();
export default reduxStoreInstance;
