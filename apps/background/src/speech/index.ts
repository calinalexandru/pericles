import { Subject, } from 'rxjs';

import { DEFAULT_VALUES,  } from '@pericles/constants';
import { SettingsState, } from '@pericles/store';

import ChromeSynth from './synth/ChromeSynth';
import { UtteranceEvent, } from './synth/Utterance';

interface StreamParams {
  event: string;
  params: UtteranceEvent;
}

type SettingsValues = {
  volume: number;
  pitch: number;
  rate: number;
  voice: number;
};

export default class Speech {

  private static settingsMap: Map<
    keyof SettingsValues,
    (value: number) => void
  > = new Map();

  public static synth: ChromeSynth = new ChromeSynth();

  public static stream$: Subject<StreamParams> = new Subject<StreamParams>();

  private static volume: number = DEFAULT_VALUES.SETTINGS.VOLUME;

  private static pitch: number = DEFAULT_VALUES.SETTINGS.PITCH;

  private static rate: number = DEFAULT_VALUES.SETTINGS.RATE;

  constructor() {
    Speech.settingsMap.set('volume', Speech.setVolume);
    Speech.settingsMap.set('pitch', Speech.setPitch);
    Speech.settingsMap.set('rate', Speech.setRate);
    Speech.settingsMap.set('voice', Speech.setVoice);
    Speech.attachStreams();
  }

  private static attachStreams(): void {
    const events: string[] = [ 'onStart', 'onEnd', 'onError', 'onBoundary', ];

    console.log('Attaching streams...');
    events.forEach((event) => {
      (this.synth as any)[event] = (params: UtteranceEvent) => {
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
    Speech.stream$.next({
      event: 'onError',
      params: { type: 'error', errorMessage: code, },
    });
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

  public static setSettingsFromObj(settings: Partial<SettingsState>) {
    console.log('setSettingsFromObj', settings);

    for (const [ key, value, ] of Object.entries(settings)) {
      if (typeof value === 'number') {
        const settingFunction = this.settingsMap.get(
          key as keyof SettingsValues
        );
        settingFunction?.(value);
      }
    }
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
