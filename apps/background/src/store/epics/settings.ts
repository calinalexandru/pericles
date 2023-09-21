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
import { isPaused, isPlayingOrReady, } from '@pericles/util';

const settingsItems = [ 'volume', 'pitch', 'rate', 'voice', ];

const filterObjectByKeys = (obj: Partial<SettingsState>, keys: string[]) =>
  Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = (obj as any)[key];
      return acc;
    }, {} as { [key: string]: string });

const settingsSetEpic: EpicFunction = (action, state) =>
  action.pipe(
    ofType(getType(settingsActions.set)),
    pluck('payload'),
    concatMap((payload) => {
      console.log('settings.set epic', payload, state.value);

      const filteredPayload = filterObjectByKeys(payload, settingsItems);

      if (
        isPaused(playerStatusSelector(state.value)) &&
        Object.keys(filteredPayload).length > 0
      ) {
        return of(playerActions.stop());
      }
      if (
        isPlayingOrReady(playerStatusSelector(state.value)) &&
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
