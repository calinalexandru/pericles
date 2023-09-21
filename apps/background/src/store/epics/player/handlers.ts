import { StateObservable, } from 'redux-observable';

import Speech from '@/speech';
import { PlayerSectionsType, SectionType, } from '@pericles/constants';
import {
  AllActions,
  PlayPayloadType,
  RootState,
  parserEndSelector,
  parserTypeSelector,
  playerActions,
  playerKeySelector,
  playerSectionsSelector,
  playerTabSelector,
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
  payload: PlayPayloadType,
  actions: AllActions[]
): AllActions | false => {
  const { userGenerated = false, } = payload || {};

  const state = state$.value;
  const { playerSections, playerKey, playingTab, } = {
    playerSections: playerSectionsSelector(state),
    playerKey: playerKeySelector(state),
    playingTab: playerTabSelector(state),
  };

  if (shouldRequestAndPlay(state, userGenerated, playerSections)) {
    Speech.stop();
    return playerActions.proxyResetAndRequestPlay(payload);
  }

  if (
    shouldRequestSectionsAndPlay(state, playingTab, playerSections, playerKey)
  ) {
    Speech.stop();
    return playerActions.proxySectionsRequestAndPlay(payload);
  }

  if (actions.length === 0) {
    Speech.stop();
    try {
      Speech.play(playerSections[playerKey].text);
    } catch (e) {
      console.error('Player has crashed', playerSections[playerKey].text, e);
      return playerActions.crash('Player has crashed');
    }
  }

  return false;
};
