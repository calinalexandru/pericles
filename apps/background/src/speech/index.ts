import { keys, } from 'ramda';
import { Subject, } from 'rxjs';

import { DEFAULT_VALUES, } from '@pericles/constants';

import ChromeSynth from './synth/chrome';

interface StreamParams {
  event: string;
  params: any;
}

interface Settings {
  voices?: any[];
  volume?: number;
  pitch?: number;
  rate?: number;
  voice?: string;
}

export default class Speech {

  public static synth: ChromeSynth = new ChromeSynth();

  public static stream$: Subject<StreamParams> = new Subject<StreamParams>();

  private static volume: number = DEFAULT_VALUES.SETTINGS.VOLUME;

  private static pitch: number = DEFAULT_VALUES.SETTINGS.PITCH;

  private static rate: number = DEFAULT_VALUES.SETTINGS.RATE;

  constructor() {
    Speech.attachStreams();
  }

  private static attachStreams(): void {
    const events: string[] = [
      'onStart',
      'onEnd',
      'onError',
      'onBoundary',
      'onBuffering',
      'onWordsUpdate',
    ];

    console.log('Attaching streams...');
    events.forEach((event) => {
      this.synth[event] = (params) => {
        console.log(`SpeechFacade.synth.${event}`, params);
        this.stream$.next({ event, params, });
      };
    });
  }

  private static seedValues(): void {
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
    Speech.synth = new ChromeSynth();

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

  public static setSettingsFromObj(settings: Settings) {
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

// initialize the speechness
(() => new Speech())();
