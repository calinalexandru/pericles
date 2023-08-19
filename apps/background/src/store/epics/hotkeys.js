// /* eslint-disable no-unused-vars */
import { pick, } from 'ramda';
import { combineEpics, ofType, } from 'redux-observable';
import { tap, ignoreElements, pluck, } from 'rxjs/operators';

import { LOCAL_STORAGE_SETTINGS, } from '@pericles/constants';
import { hotkeysActions, } from '@pericles/store';
import { LocalStorage, } from '@pericles/util';

const { hotkeys, } = hotkeysActions;

const hotkeysSetEpic = (action) =>
  action.pipe(
    ofType(hotkeys.set, hotkeys.default),
    tap((act) => {
      console.log('hotkeys.set', act);
    }),
    pluck('payload'),
    tap((payload = {}) => {
      console.log('hotkeys.set', payload);
      LocalStorage.merge(pick(LOCAL_STORAGE_SETTINGS.HOTKEYS.ITEMS, payload))
        .then((response) => {
          console.log('hotkeys.storage is merged', response);
        })
        .catch((e) => console.error(e));
    }),
    ignoreElements()
  );

export default combineEpics(hotkeysSetEpic);
