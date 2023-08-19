import { join, pipe, } from 'ramda';

import getBrowserAPI from '../util/getBrowserAPI';

import getCountry from './getCountry';
import getCountryCodeFromString from './getCountryCodeFromString';
import getIsoLang from './getIsoLang';
import getIsoLangFromString from './getIsoLangFromString';
import getNativeNameFromIsoLang from './getNativeNameFromIsoLang';
import getTagsFromCountry from './getTagsFromCountry';

const setVoices = (voices) => {
  // console.log('setVoices', voices);
  let voiceNames = [];
  const groupMap = [];
  let groupId;
  let groupMatch = [];
  let name = '';
  const voiceProviders = [ 'Google', 'Microsoft', 'eSpeak', 'Chrome OS', ];
  const voiceProvidersRegex = new RegExp(voiceProviders.join('|'));
  voiceNames = voices.map((item, key) => {
    name = item.voiceName || item.name;
    groupMatch = name.match(voiceProvidersRegex);
    if (groupMatch && groupMatch[0]) {
      groupId = groupMap.indexOf(groupMatch[0]);
      if (groupId === -1) {
        groupMap.push(groupMatch[0]);
        groupId = groupMap.length - 1;
      }
    }
    const out = {
      id: key,
      lang: item.lang,
      local: item.lang,
      countryCode: item.lang,
      text: name,
      groupName: groupMap[groupId] || '',
      nativeName: pipe(
        getIsoLangFromString,
        getIsoLang,
        getNativeNameFromIsoLang
      )(item.lang),
      tags: pipe(
        getCountryCodeFromString,
        getCountry,
        getTagsFromCountry,
        join(' ')
      )(item.lang),
      shortTitle: name,
    };
    const compoundLangRegex = new RegExp('[a-z]{2}-[a-z]{2}', 'i');
    if (compoundLangRegex.test(item.lang)) {
      out.countryCode = item.lang.slice(3).toLocaleUpperCase();
    } else out.countryCode = item.lang ? item.lang.toLocaleUpperCase() : null;

    out.shortTitle = out.text;
    if (groupMatch && groupMatch[0]) {
      out.shortTitle = out.text.replace(groupMatch[0], '');
    }

    return out;
  });

  if (voiceNames.findIndex((voice) => voice.groupName === 'Chrome OS') !== -1) {
    voiceNames = voiceNames.sort((a, b) =>
      b.groupName === 'Chrome OS' && a.groupName !== 'Chrome OS' ? 1 : -1
    );
  }

  return voiceNames;
};

export default function getBrowserAPIVoices() {
  return new Promise((resolve, reject) => {
    const { api: browserAPI, } = getBrowserAPI();
    try {
      if (browserAPI.tts) {
        browserAPI.tts.getVoices(async (voices) => {
          resolve(setVoices(voices));
        });
      } else {
        const voices = speechSynthesis.getVoices();
        resolve(setVoices(voices));
      }
    } catch (e) {
      reject(e);
    }
  });
}
