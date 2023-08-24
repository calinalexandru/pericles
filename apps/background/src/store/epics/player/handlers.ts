import { pathOr, } from 'ramda';

import Speech from '@/speech';
import {
  appActiveTabSelector,
  parserEndSelector,
  parserTypeSelector,
  playerCrash,
  playerKeySelector,
  playerReset,
  playerSectionsSelector,
  playerTabSelector,
  resetParser,
  sectionsRequestAndPlay,
} from '@pericles/store';
import {
  hasSectionsInAdvance,
  isGoogleDocsSvg,
  mpToContent,
} from '@pericles/util';

export const playOrRequest$: any = (state, payload, actions) => {
  console.log('play.epic', state, payload);

  const userGenerated = pathOr(false, [ 'userGenerated', ], payload);
  const seek = pathOr(0, [ 'seek', ], payload);
  const playerKeyPayload = Number(pathOr(-1, [ 'key', ], payload));
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
    seek,
    userGenerated,
    playingTab,
    activeTab,
  });
  if (
    (userGenerated && playingTab !== activeTab) ||
    (!playerSections.length && isGoogleDocsSvg(parserTypeSelector(state.value)))
  ) {
    Speech.stop();
    console.log('playOrRequest.userGenerated.requestAndPlay', {
      userGenerated,
      playingTab,
      activeTab,
      playerSections,
    });
    mpToContent(
      [
        resetParser(),
        playerReset({ tab: activeTab, }),
        sectionsRequestAndPlay(payload),
      ],
      activeTab
    );
  } else if (
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

    mpToContent([ sectionsRequestAndPlay(payload), ], playingTab);
  } else if (actions.length === 0) {
    Speech.stop();
    console.log(
      'playOrRequest.playing - key, seek',
      seek,
      playerKey,
      playerSections
    );
    try {
      // const a = new SpeechSynthesisUtterance('Firefox is broken');
      // const b = new SpeechSynthesisUtterance('Broken inside its crazy');
      // speechSynthesis.speak(a)
      // a.onend = () => {
      //   speechSynthesis.speak(b)
      // }
      // const voice = settingsVoiceSelector(state.value);
      // if (!Speech.validate(voice)) Speech.setVoice(voice);
      Speech.play(playerSections[playerKey].text, seek);
    } catch (e) {
      console.error('Player has crashed, rip', e);
      return playerCrash();
    }
  } else {
    console.log('Speech is switching to free, do nothing');
  }
  return false;
};
