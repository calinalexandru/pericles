import { keys, } from 'ramda';
import { Subject, } from 'rxjs';

import { DEFAULT_VALUES, } from '@pericles/constants';

import ChromeSynth from './synth/chrome';

const chrome = new ChromeSynth();

export default class Speech {

  constructor() {
    Speech.attachStreams();
  }

  static attachStreams() {
    console.log('Speech.attachStreams');
    Speech.synth.onStart = (params) => {
      Speech.stream$.next({ event: 'onStart', params, });
    };

    Speech.synth.onEnd = (params) => {
      console.log('Speech.synth.onEnd', params);
      Speech.stream$.next({ event: 'onEnd', params, });
    };

    Speech.synth.onError = (params) => {
      Speech.stream$.next({ event: 'onError', params, });
    };

    Speech.synth.onBoundary = (params) => {
      Speech.stream$.next({ event: 'onBoundary', params, });
    };

    Speech.synth.onBuffering = (params) => {
      Speech.stream$.next({ event: 'onBuffering', params, });
    };

    Speech.synth.onWordsUpdate = (params) => {
      Speech.stream$.next({ event: 'onWordsUpdate', params, });
    };

    Speech.synth.onCreditsBurn = (params) => {
      Speech.stream$.next({ event: 'onCreditsBurn', params, });
    };

    // Speech.synth.onPause = () => {
    //   Speech.stream$.next({ event: 'onPause' });
    // };

    // Speech.synth.onResume = () => {
    //   Speech.stream$.next({ event: 'onResume' });
    // };
  }

  static seedValues() {
    Speech.setVolume(Speech.volume);
    Speech.setPitch(Speech.pitch);
    Speech.setRate(Speech.rate);
    Speech.setServiceKey(Speech.serviceKey);
    Speech.setServiceRegion(Speech.serviceRegion);
  }

  static play(text, seek = 0, demand = false) {
    if (!text) {
      throw new Error('Speech: text is empty');
      // TODO:: change editor state
    }
    // console.log('play');
    Speech.synth.speak(text, seek, demand);
  }

  static validate(voice) {
    return voice === Speech.synth.voice;
  }

  static crash(code) {
    Speech.stream$.next({ event: 'onError', params: { code, }, });
  }

  static continue() {
    Speech.synth.continue();
  }

  static stop() {
    console.log('stop', Speech.synth);
    Speech.synth.cancel();
  }

  static pause() {
    // console.log('paus');
    Speech.synth.clearResumeInfinity();
    Speech.synth.pause();
  }

  static resume() {
    // console.log('resume');
    Speech.synth.activateResumeInfinity();
    Speech.synth.resume();
  }

  static setVolume(val) {
    Speech.volume = val;
    try {
      Speech.synth.setVolume(val);
    } catch (e) {
      console.warn('setVolume', e);
    }
  }

  static setPitch(val) {
    Speech.pitch = val;
    Speech.synth.setPitch(val);
  }

  static setRate(val) {
    Speech.rate = val;
    Speech.synth.setRate(val);
  }

  static setVoice(val) {
    console.log('setVoice', val);
    const newVal = val;
    const oldSynth = Speech.synth;
    Speech.synth = chrome;

    if (oldSynth !== Speech.synth) oldSynth.cancel();

    Speech.attachStreams();
    Speech.seedValues();

    Speech.synth.setVoice(newVal);
  }

  static setServiceRegion(region) {
    Speech.serviceRegion = region;
    Speech.synth.setServiceRegion(region);
  }

  static setServiceKey(key) {
    Speech.serviceKey = key;
    Speech.synth.setServiceKey(key);
  }

  static getSettingByIndex(name) {
    return Speech.getSettingsMap()[name];
  }

  static getSettingsMap() {
    return {
      volume: Speech.setVolume.bind(null),
      pitch: Speech.setPitch.bind(null),
      rate: Speech.setRate.bind(null),
      voice: Speech.setVoice.bind(null),
    };
  }

  static setSettingsFromObj(settings) {
    console.log('setSettingsFromObj', settings);
    let fn;
    keys(settings).forEach((index) => {
      fn = Speech.getSettingByIndex(index);
      if (fn) {
        fn(settings[index]);
      }
    });
  }

  static isReplayStarved(settings) {
    console.log('Speech.isReplayStarved', settings);
    return Speech.synth.isReplayStarved(settings);
  }

  static getSeekerTime() {
    return Speech.synth.getSeekerTime();
  }

  static seek(time) {
    return Speech.synth.seek(time);
  }

}

Speech.synth = chrome;
Speech.stream$ = new Subject();
Speech.volume = DEFAULT_VALUES.SETTINGS.VOLUME;
Speech.pitch = DEFAULT_VALUES.SETTINGS.PITCH;
Speech.rate = DEFAULT_VALUES.SETTINGS.RATE;
Speech.serviceKey = DEFAULT_VALUES.APP.SERVICE_KEY;
Speech.serviceRegion = DEFAULT_VALUES.APP.SERVICE_REGION;

const a = new Speech();
