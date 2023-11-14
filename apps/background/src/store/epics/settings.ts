import { getType, } from '@reduxjs/toolkit';
import { combineEpics, ofType, } from 'redux-observable';
import { of, } from 'rxjs';
import { pluck, concatMap, } from 'rxjs/operators';

import Speech from '@/speech';
import {
  EpicFunction,
  SettingsState,
  playerActions,
  playerStatusSelector,
  settingsActions,
} from '@pericles/store';
import { isPaused, isPlaying, isPlayingOrReady, } from '@pericles/util';

function filterObjectByKeys<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);
}

type SettingsKeys = 'volume' | 'pitch' | 'rate' | 'voice';
type SettingsKeysState = {
  volume: number;
  pitch: number;
  rate: number;
  voice: number;
};

const settingsItems: SettingsKeys[] = [ 'volume', 'pitch', 'rate', 'voice', ];

const settingsSetEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(settingsActions.set)),
    pluck('payload'),
    concatMap((payload) => {
      Speech.setSettingsFromObj(payload);

      const filteredPayload = filterObjectByKeys<
        Partial<SettingsState>,
        SettingsKeysState
      >(payload, settingsItems);

      if (
        isPaused(playerStatusSelector(state.value)) &&
        Object.keys(filteredPayload).length > 0
      ) {
        return of(playerActions.stop());
      }
      console.log('settings.set epic', payload, state.value, filteredPayload);
      if (
        isPlaying(playerStatusSelector(state.value)) &&
        Object.keys(filteredPayload).length > 0
      ) {
        if (Speech.isReplayStarved(Object.keys(filteredPayload))) {
          Speech.stop();
          return of(
            playerActions.play({ userGenerated: false, fromCursor: false, })
          );
        }
      }

      return of(playerActions.idle());
    })
  );

export default combineEpics(settingsSetEpic);
