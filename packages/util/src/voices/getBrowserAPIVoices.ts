import { VoiceType, } from '@pericles/constants';

import { getBrowserAPI, } from '../util/getBrowserAPI';

import getCountry from './getCountry';
import getCountryCodeFromString from './getCountryCodeFromString';
import getIsoLang from './getIsoLang';
import getIsoLangFromString from './getIsoLangFromString';
import getNativeNameFromIsoLang from './getNativeNameFromIsoLang';
import getTagsFromCountry from './getTagsFromCountry';

interface VoiceItem {
  voiceName?: string;
  name?: string;
  lang: string;
}

const setVoices = (voices: VoiceItem[]): VoiceType[] => {
  let voiceNames: VoiceType[] = [];
  const groupMap: string[] = [];
  let groupId: number;
  let groupMatch: RegExpMatchArray | null;
  let name = '';
  const voiceProviders = [ 'Google', 'Microsoft', 'eSpeak', 'Chrome OS', ];
  const voiceProvidersRegex = new RegExp(voiceProviders.join('|'));

  voiceNames = voices.map((item, key) => {
    name = item.voiceName || item.name || '';
    groupMatch = name.match(voiceProvidersRegex);

    if (groupMatch && groupMatch[0]) {
      groupId = groupMap.indexOf(groupMatch[0]);
      if (groupId === -1) {
        groupMap.push(groupMatch[0]);
        groupId = groupMap.length - 1;
      }
    }

    const out: VoiceType = {
      id: key,
      lang: item.lang,
      local: item.lang,
      countryCode: item.lang,
      text: name,
      groupName: groupMap[groupId] || '',
      nativeName: getNativeNameFromIsoLang(
        getIsoLang(getIsoLangFromString(item.lang))
      ),
      tags: getTagsFromCountry(
        getCountry(getCountryCodeFromString(item.lang))
      ).join(' '),
      shortTitle: name,
    };

    const compoundLangRegex = /^[a-z]{2}-[a-z]{2}$/i;
    if (compoundLangRegex.test(item.lang)) {
      out.countryCode = item.lang.slice(3).toUpperCase();
    } else {
      out.countryCode = item.lang ? item.lang.toUpperCase() : '';
    }

    if (groupMatch && groupMatch[0]) {
      out.shortTitle = out.text.replace(groupMatch[0], '');
    }

    return out;
  });

  if (voiceNames.findIndex((voice) => voice.groupName === 'Chrome OS') !== -1) {
    voiceNames.sort((a, b) =>
      b.groupName === 'Chrome OS' && a.groupName !== 'Chrome OS' ? 1 : -1
    );
  }

  return voiceNames;
};

export default function getBrowserAPIVoices(): Promise<VoiceType[]> {
  return new Promise((resolve, reject) => {
    const { api: browserAPI, } = getBrowserAPI();
    try {
      if (browserAPI.tts) {
        browserAPI.tts.getVoices((voices: any) => {
          resolve(setVoices(voices));
        });
      } else {
        const voices: any = speechSynthesis.getVoices();
        resolve(setVoices(voices));
      }
    } catch (e) {
      reject(e);
    }
  });
}
