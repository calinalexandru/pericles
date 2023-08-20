class ReduxStore {

  constructor() {
    this._store = null;
  }

  get current() {
    return this._store;
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

}

const reduxStoreInstance = new ReduxStore();

export default reduxStoreInstance;
