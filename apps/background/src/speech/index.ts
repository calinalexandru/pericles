import { Subject, } from 'rxjs';

import { DEFAULT_VALUES, SettingKeys, } from '@pericles/constants';

import ChromeSynth from './synth/ChromeSynth';
import { UtteranceEvent, } from './synth/Utterance';

interface StreamParams {
  event: string;
  params: UtteranceEvent;
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
    ];

    console.log('Attaching streams...');
    events.forEach((event) => {
      (this.synth as any)[event] = (params: any) => {
        console.log(`SpeechFacade.synth.${event}`, params);
        this.stream$.next({ event, params, });
      };
    });
  }

  private static seedValues(): void {
    Speech.setVolume(Speech.volume);
    Speech.setPitch(Speech.pitch);
    Speech.setRate(Speech.rate);
  }

  static play(text: string) {
    if (!text) {
      throw new Error('Speech: text is empty');
      // TODO:: change editor state
    }
    // console.log('play');
    Speech.synth.speak(text);
  }

  static validate(voice: number) {
    return voice === Speech.synth.voice;
  }

  static crash(code: string) {
    Speech.stream$.next({ event: 'onError', params: {type: 'error', errorMessage: code, }, });
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

  static setVolume(val: number) {
    Speech.volume = val;
    try {
      Speech.synth.setVolume(val);
    } catch (e) {
      console.warn('setVolume', e);
    }
  }

  static setPitch(val: number) {
    Speech.pitch = val;
    Speech.synth.setPitch(val);
  }

  static setRate(val: number) {
    Speech.rate = val;
    Speech.synth.setRate(val);
  }

  static setVoice(val: number) {
    console.log('setVoice', val);
    const newVal = val;
    const oldSynth = Speech.synth;
    Speech.synth = new ChromeSynth();

    if (oldSynth !== Speech.synth) oldSynth.cancel();

    Speech.attachStreams();
    Speech.seedValues();

    Speech.synth.setVoice(newVal);
  }

  static getSettingByIndex(name: SettingKeys) {
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

  public static setSettingsFromObj(settings: any) {
    console.log('setSettingsFromObj', settings);
    let fn: any;
    Object.keys(settings).forEach((index: string) => {
      const key = index as SettingKeys;
      fn = Speech.getSettingByIndex(key);
      if (fn && settings[key] !== undefined) {
        fn(settings[key] as any);
      }
    });
  }

  static isReplayStarved(settings: any) {
    console.log('Speech.isReplayStarved', settings);
    return Speech.synth.isReplayStarved(settings);
  }

  static getSeekerTime() {
    return Speech.synth.getSeekerTime();
  }

}

// initialize the speechness
(() => new Speech())();
