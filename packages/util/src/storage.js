// /* eslint-disable no-unused-vars */
import { values, } from 'ramda';
import { from, } from 'rxjs';
import { reduce, concatAll, filter, } from 'rxjs/operators';

import getStorageAPI from './util/getStorageAPI';

export default class LocalStorage {

  static api() {
    return getStorageAPI();
  }

  static get(name) {
    return new Promise((resolve, reject) => {
      try {
        LocalStorage.api().get(name, (data) => {
          // console.log('LocalStorage.api().get', name, data);
          resolve({
            [name]: JSON.parse(data[name] || null),
          });
        });
      } catch (e) {
        resolve({
          [name]: null,
        });
      }
    });
  }

  static async getAsync(name) {
    try {
      return await LocalStorage.get(name);
    } catch (e) {
      console.error('getAsync', e);
      return undefined;
    }
  }

  static set(name, value) {
    return new Promise((resolve, reject) => {
      try {
        const data = {
          [name]: JSON.stringify(value),
        };
        // console.log('LocalStorage.api().set', name, value);
        LocalStorage.api().set(data, () => {
          resolve(data);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  static remove(name) {
    LocalStorage.api().remove(name);
  }

  static merge(payload) {
    const promises = [];
    Object.keys(payload).forEach((key) => {
      promises.push(LocalStorage.set(key, payload[key]));
    });
    return Promise.all(promises);
  }

  static getItemFromStorage(item) {
    return from(LocalStorage.get(item));
  }

  // static getItemsFromStorage(items) {
  //   return from(items).pipe(
  //     mergeMap((arrItem) => of(LocalStorage.get(arrItem))),
  //     tap((out) => console.log('herelook', out))
  //   );
  // }

  static getItemsFromStorage(items) {
    return from(items.map((item) => LocalStorage.get(item))).pipe(
      concatAll(),
      filter((item) =>
        values(item).every((val) => ![ undefined, null, ].includes(val))
      ),
      reduce((out, current) => ({ ...out, ...current, }), {})
    );
  }

  static clearAll() {
    LocalStorage.api().clear();
  }

}
