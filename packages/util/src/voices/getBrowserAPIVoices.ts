import { VoiceType, } from '@pericles/constants';

import { getBrowserAPI, } from '../util/getBrowserAPI';

import getCountry from './getCountry';
import getCountryCodeFromString from './getCountryCodeFromString';
import getIsoLang from './getIsoLang';
import getIsoLangFromString from './getIsoLangFromString';
import getNativeNameFromIsoLang from './getNativeNameFromIsoLang';
import getTagsFromCountry from './getTagsFromCountry';

const VOICE_PROVIDERS = [ 'Google', 'Microsoft', 'eSpeak', 'Chrome OS', ];
const VOICE_PROVIDERS_REGEX = new RegExp(VOICE_PROVIDERS.join('|'));
const COMPOUND_LANG_REGEX = /^[a-z]{2}-[a-z]{2}$/i;

const extractGroupNameFromVoiceName = (
  voiceName: string,
  groupMap: string[]
): string => {
  const groupMatch = voiceName.match(VOICE_PROVIDERS_REGEX);

  if (groupMatch && groupMatch[0]) {
    const foundIndex = groupMap.indexOf(groupMatch[0]);
    if (foundIndex === -1) {
      groupMap.push(groupMatch[0]);
      return groupMatch[0];
    }
    return groupMap[foundIndex];
  }

  return '';
};

const extractCountryCode = (lang: string): string =>
  COMPOUND_LANG_REGEX.test(lang)
    ? lang.slice(3).toUpperCase()
    : lang.toUpperCase();

const setVoices = (voices: chrome.tts.TtsVoice[]): VoiceType[] => {
  const groupMap: string[] = [];

  const voiceNames = voices.map((item, index) => {
    const voiceName = item.voiceName || '';
    const groupName = extractGroupNameFromVoiceName(voiceName, groupMap);

    const voice: VoiceType = {
      id: index,
      lang: item.lang || '',
      local: item.lang || '',
      countryCode: extractCountryCode(item.lang || ''),
      text: voiceName,
      groupName,
      nativeName: getNativeNameFromIsoLang(
        getIsoLang(getIsoLangFromString(item.lang || ''))
      ),
      tags: getTagsFromCountry(
        getCountry(getCountryCodeFromString(item.lang || ''))
      ).join(' '),
      shortTitle: groupName ? voiceName.replace(groupName, '') : voiceName,
    };

    return voice;
  });

  // Separate the voices based on the group name without changing their relative order.
  const chromeOSVoices = voiceNames.filter(
    (voice) => voice.groupName === 'Chrome OS'
  );
  const otherVoices = voiceNames.filter(
    (voice) => voice.groupName !== 'Chrome OS'
  );

  // Merge them together: first the non-'Chrome OS' voices, then the 'Chrome OS' voices.
  return [ ...otherVoices, ...chromeOSVoices, ];
};

export default function getBrowserAPIVoices(): Promise<VoiceType[]> {
  return new Promise((resolve, reject) => {
    const { api: browserAPI, } = getBrowserAPI();
    try {
      browserAPI.tts.getVoices((voices) => {
        console.log('browserAPI.tts.getVoices', voices);
        resolve(setVoices(voices));
      });
    } catch (e) {
      reject(e);
    }
  });
}
