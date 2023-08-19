import { combineEpics, createEpicMiddleware, } from 'redux-observable';
import thunk from 'redux-thunk';
import { Store, applyMiddleware, } from 'webext-redux';

import appEpic from './epics/app';
import parserEpic from './epics/parser';

const rootEpic = combineEpics(parserEpic, appEpic);
const observableMiddleware = createEpicMiddleware();
const store = new Store();
const storeWithMiddleware = applyMiddleware(store, thunk, observableMiddleware);
observableMiddleware.run(rootEpic);

export default storeWithMiddleware;
