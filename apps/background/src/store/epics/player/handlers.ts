import { Action, } from 'redux';
import { StateObservable, } from 'redux-observable';

import Speech from '@/speech';
import { PlayerSectionsType, SectionType, } from '@pericles/constants';
import {
  RootState,
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

const shouldRequestAndPlay = (
  state: RootState,
  userGenerated: boolean,
  playerSections: SectionType[]
): boolean =>
  userGenerated ||
  (!playerSections.length && isGoogleDocsSvg(parserTypeSelector(state)));

const shouldRequestSectionsAndPlay = (
  state: RootState,
  playingTab: number,
  playerSections: PlayerSectionsType[],
  playerKey: number
): boolean =>
  playingTab !== 0 &&
  !parserEndSelector(state) &&
  !hasSectionsInAdvance(playerSections, playerKey);

export const playOrRequest$ = (
  state$: StateObservable<RootState>,
  payload: any,
  actions: any[]
): Action<any> | false => {
  const { userGenerated = false, key = -1, } = payload || {};

  const state = state$.value;
  const { playerSections, playerKey, playingTab, } = {
    playerSections: playerSectionsSelector(state),
    playerKey: key !== -1 ? key : playerKeySelector(state),
    playingTab: playerTabSelector(state),
  };

  if (shouldRequestAndPlay(state, userGenerated, playerSections)) {
    Speech.stop();
    return proxyResetAndRequestPlay.request(payload);
  }

  if (
    shouldRequestSectionsAndPlay(state, playingTab, playerSections, playerKey)
  ) {
    Speech.stop();
    return proxySectionsRequestAndPlay.request(payload);
  }

  if (actions.length === 0) {
    Speech.stop();
    try {
      Speech.play(playerSections[playerKey].text);
    } catch (e) {
      console.error('Player has crashed', playerSections[playerKey].text, e);
      return playerCrash({ message: 'Player has crashed', });
    }
  }

  return false;
};
