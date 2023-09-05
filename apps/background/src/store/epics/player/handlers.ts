import { StateObservable, } from 'redux-observable';

import Speech from '@/speech';
import {
  RootState,
  appActiveTabSelector,
  parserEndSelector,
  parserTypeSelector,
  playerCrash,
  playerKeySelector,
  playerSectionsSelector,
  playerTabSelector,
  proxyResetAndRequestPlay,
  proxySectionsRequestAndPlay,
} from '@pericles/store';
import { hasSectionsInAdvance, isGoogleDocsSvg, } from '@pericles/util';

export const playOrRequest$: any = (
  state: StateObservable<RootState>,
  payload: any,
  actions: any
) => {
  console.log('play.epic', state, payload);

  const userGenerated = payload?.userGenerated || false;
  const playerKeyPayload = payload?.key || -1;
  const playerSections = playerSectionsSelector(state.value);
  const playerKey =
    playerKeyPayload !== -1 ? playerKeyPayload : playerKeySelector(state.value);
  const playingTab = playerTabSelector(state.value);
  const activeTab = appActiveTabSelector(state.value);
  console.log('play.epic debug', {
    actions,
    playerSections,
    playerKey,
    playerKeyPayload,
    userGenerated,
    playingTab,
    activeTab,
  });
  if (
    userGenerated ||
    (!playerSections.length && isGoogleDocsSvg(parserTypeSelector(state.value)))
  ) {
    Speech.stop();
    console.log('playOrRequest.userGenerated.requestAndPlay', {
      userGenerated,
      playingTab,
      activeTab,
      playerSections,
    });

    return proxyResetAndRequestPlay.request(payload);
  }

  if (
    playingTab !== 0 &&
    !parserEndSelector(state.value) &&
    !hasSectionsInAdvance(playerSections, playerKey)
  ) {
    Speech.stop();
    console.log(
      'playOrRequest.!hasSectionsInAdvance.requestAndPlay',
      playerSections,
      playerKey
    );

    return proxySectionsRequestAndPlay.request(payload);
  }
  if (actions.length === 0) {
    Speech.stop();
    console.log('playOrRequest.playing - key, seek', playerKey, playerSections);
    try {
      Speech.play(playerSections[playerKey].text);
    } catch (e) {
      console.error('Player has crashed, rip', e);
      return playerCrash({ message: 'Player has crashed', });
    }
  } else {
    console.log('Speech is switching to free, do nothing');
  }
  return false;
};
