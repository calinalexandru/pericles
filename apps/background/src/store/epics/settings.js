// /* eslint-disable no-unused-vars */
import { pick, isEmpty, keys, } from 'ramda';
import { combineEpics, ofType, } from 'redux-observable';
import { of, } from 'rxjs';
import { pluck, map, concatMap, } from 'rxjs/operators';

import Speech from '@/speech';
import {
  playerStatusSelector,
  playerActions,
  settingsVoicesSelector,
  SettingsActionTypes,
  freeVoice,
  setSettings,
} from '@pericles/store';
import { isPaused, isPlayingOrReady, getEnglishVoiceKey, } from '@pericles/util';

const { player, } = playerActions;

const settingsItems = [ 'volume', 'pitch', 'rate', 'voice', ];

const settingsSetEpic = (action, state) =>
  action.pipe(
    ofType(SettingsActionTypes.SET, SettingsActionTypes.DEFAULT),
    pluck('payload'),
    map((payload) => {
      console.log('settings.set', payload);
      const seek = Speech.getSeekerTime();
      Speech.setSettingsFromObj(payload);
      return { payload, seek, };
    }),
    concatMap(({ payload = {}, seek = 0, }) => {
      console.log('settings.set epic', payload, state.value);
      if (
        isPaused(playerStatusSelector(state.value)) &&
        !isEmpty(pick(settingsItems, payload))
      ) {
        return of(player.stop());
      }
      if (
        isPlayingOrReady(playerStatusSelector(state.value)) &&
        !isEmpty(pick(settingsItems, payload))
      ) {
        if (Speech.isReplayStarved(keys(pick(settingsItems, payload)))) {
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
    ofType(freeVoice.request),
    map(() => {
      console.log('settingsSetFreeVoiceEpic');
      //
      return getEnglishVoiceKey(settingsVoicesSelector(state.value));
    }),
    map((voice) => setSettings({ voice, }))
  );

export default combineEpics(settingsSetEpic, settingsSetFreeVoiceEpic);
