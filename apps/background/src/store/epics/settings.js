// /* eslint-disable no-unused-vars */
import { pick, isEmpty, keys, } from 'ramda';
import { combineEpics, ofType, } from 'redux-observable';
import { of, } from 'rxjs';
import { pluck, map, concatMap, } from 'rxjs/operators';

import Speech from '@/speech';
import { LOCAL_STORAGE_SETTINGS, } from '@pericles/constants';
import {
  settingsActions,
  playerStatusSelector,
  playerActions,
  settingsVoicesSelector,
} from '@pericles/store';
import {
  isPaused,
  isPlayingOrReady,
  LocalStorage,
  getEnglishVoiceKey,
} from '@pericles/util';

const { settings, } = settingsActions;
const { player, } = playerActions;

const settingsSetEpic = (action, state) =>
  action.pipe(
    ofType(settings.set, settings.default),
    pluck('payload'),
    map((payload) => {
      console.log('settings.set', payload);
      const seek = Speech.getSeekerTime();
      Speech.setSettingsFromObj(payload);
      const savedSettings = pick(
        LOCAL_STORAGE_SETTINGS.SETTINGS.ITEMS,
        payload
      );
      if (!isEmpty(savedSettings)) {
        LocalStorage.merge(savedSettings)
          .then((response) => {
            console.log('storage is merged', response);
          })
          .catch((e) => console.error(e));
      }
      return { payload, seek, };
    }),
    concatMap(({ payload = {}, seek = 0, }) => {
      console.log('settings.set epic', payload, state.value);
      if (
        isPaused(playerStatusSelector(state.value)) &&
        !isEmpty(pick(LOCAL_STORAGE_SETTINGS.SETTINGS.ITEMS, payload))
      ) {
        return of(player.stop());
      }
      if (
        isPlayingOrReady(playerStatusSelector(state.value)) &&
        !isEmpty(pick(LOCAL_STORAGE_SETTINGS.SETTINGS.ITEMS, payload))
      ) {
        if (
          Speech.isReplayStarved(
            keys(pick(LOCAL_STORAGE_SETTINGS.SETTINGS.ITEMS, payload))
          )
        ) {
          console.log('Speech.isReplayStarved -> settingsSetEpic.seek', seek);
          Speech.stop();
          return of(player.play({ userGenerated: true, seek, }));
        }
      }

      return of(player.wank());
    })
  );

const settingsSetFreeVoiceEpic = (action, state) =>
  action.pipe(
    ofType(settings.setFreeVoice),
    map(() => {
      console.log('settingsSetFreeVoiceEpic');
      //
      return getEnglishVoiceKey(settingsVoicesSelector(state.value));
    }),
    map((voice) => settings.set({ voice, }))
  );

export default combineEpics(settingsSetEpic, settingsSetFreeVoiceEpic);
