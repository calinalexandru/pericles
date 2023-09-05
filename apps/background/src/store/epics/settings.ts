import { Epic, combineEpics, ofType, } from 'redux-observable';
import { of, } from 'rxjs';
import { pluck, map, concatMap, } from 'rxjs/operators';

import Speech from '@/speech';
import {
  playerStatusSelector,
  SettingsActionTypes,
  playerPlay,
  playerStop,
  playerIdle,
} from '@pericles/store';
import { isPaused, isPlayingOrReady, } from '@pericles/util';

const settingsItems = [ 'volume', 'pitch', 'rate', 'voice', ];

const filterObjectByKeys = (obj: any, keys: string[]) =>
  Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {} as { [key: string]: string });

const settingsSetEpic: Epic<any> = (action, state) =>
  action.pipe(
    ofType(SettingsActionTypes.SET, SettingsActionTypes.DEFAULT),
    pluck('payload'),
    map((payload) => {
      console.log('settings.set', payload);
      const seek = Speech.getSeekerTime();
      Speech.setSettingsFromObj(payload);
      return { payload, seek, };
    }),
    concatMap(({ payload = {}, }) => {
      console.log('settings.set epic', payload, state.value);

      const filteredPayload = filterObjectByKeys(payload, settingsItems);

      if (
        isPaused(playerStatusSelector(state.value)) &&
        Object.keys(filteredPayload).length > 0
      ) {
        return of(playerStop());
      }
      if (
        isPlayingOrReady(playerStatusSelector(state.value)) &&
        Object.keys(filteredPayload).length > 0
      ) {
        if (Speech.isReplayStarved(Object.keys(filteredPayload))) {
          Speech.stop();
          return of(playerPlay({ userGenerated: false, fromCursor: false, }));
        }
      }

      return of(playerIdle());
    })
  );

export default combineEpics(settingsSetEpic);
