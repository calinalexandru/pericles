import { Action, } from 'redux';
import { Store as WebextStore, } from 'webext-redux';

import { WEBEXT_PORT, } from '@pericles/constants';

import { RootState, } from './initialState';

const StoreNotInitWarn = 'store is already initialized';
class ReduxStore {

  private _store: WebextStore | null;

  constructor() {
    this._store = null;
  }

  get current(): WebextStore | null {
    return this._store;
  }

  /* eslint-disable-next-line */
  createStore(): WebextStore {
    return new WebextStore({ portName: WEBEXT_PORT, });
  }

  initialize(storeInstance: WebextStore): void {
    if (!this._store) {
      this._store = storeInstance;
    } else {
      console.warn(StoreNotInitWarn);
    }
  }

  dispatch(action: Action): void {
    if (!this._store) {
      console.warn(StoreNotInitWarn);
      return;
    }
    this._store.dispatch(action);
  }

  getState(): RootState {
    if (!this._store) {
      console.warn('Store is not initialized yet');
      return null;
    }
    return this._store.getState();
  }

  subscribe(listener: () => void): void {
    if (!this._store) {
      console.warn('Store is not initialized yet');
      return;
    }
    this._store.subscribe(listener);
  }

}

const reduxStoreInstance = new ReduxStore();
export default reduxStoreInstance;
