import { getBrowserAPI, } from '@pericles/util';

import BaseSynth from './BaseSynth';
import ISynth from './ISynth';
import Utterance, { UtteranceEvent, } from './Utterance';

export default class ChromeSynth extends BaseSynth implements ISynth {

  private resumeTimer: number;

  private synth: typeof chrome.tts;

  private text: string;

  private currentMsgKey: number;

  private onEnd: (event: UtteranceEvent) => void;

  private onResume: (event: UtteranceEvent) => void;

  private onPause: (event: UtteranceEvent) => void;

  private onStart: (event: UtteranceEvent) => void;

  private onBoundary: (event: UtteranceEvent) => void;

  private isCanceled: boolean;

  constructor() {
    super();
    this.synth = getBrowserAPI().api.tts;
    this.onStart = () => {};
    this.onEnd = () => {};
    this.onBoundary = () => {};
    this.onPause = () => {};
    this.onResume = () => {};
    this.currentMsgKey = 0;
    this.text = '';
    this.resumeTimer = 0;
    this.isCanceled = false;
  }

  clearResumeInfinity() {
    clearInterval(this.resumeTimer);
  }

  activateResumeInfinity() {
    this.resumeTimer = setInterval(() => {
      console.log('chrome is tricked');
      this.pause();
      this.resume();
    }, 5000);
  }

  async speak(text: string): Promise<void> {
    this.isCanceled = false;
    this.text = text;
    let voiceObj: chrome.tts.TtsVoice | null;
    try {
      voiceObj = await this.getVoiceByKey(this.voice);
      console.log('voiceObj', this.voice, voiceObj);
    } catch (e) {
      console.error(
        'ChromeSynth.speak - voiceObj is not of type chrome.tts.TtsVoice'
      );
      return;
      voiceObj = null;
    }

    console.log('voiceObj', voiceObj, this.voice);
    const ttsOptions = Utterance.getNew({
      lang: 'en',
      volume: this.volume,
      voice: voiceObj,
      pitch: this.pitch,
      rate: this.rate,
      text: this.text,
      onStart: (e) => {
        if (this.isCanceled) return;
        this.clearResumeInfinity();
        this.activateResumeInfinity();
        this.onStart(e);
      },
      onBoundary: (e) => {
        if (this.isCanceled) return;
        this.onBoundary(e);
      },
      onEnd: (e) => {
        if (this.isCanceled) return;
        this.clearResumeInfinity();
        this.onEnd(e);
      },
      onError: (e) => {
        if (this.isCanceled) return;
        this.onEnd(e);
      },
    });

    const { text: ttsText, ...restTtsOptions } = ttsOptions;
    getBrowserAPI().api.tts.speak(ttsText, restTtsOptions);
  }

  async getVoiceByKey(voiceKey: number): Promise<chrome.tts.TtsVoice> {
    return new Promise((resolve, reject) => {
      try {
        this.synth.getVoices((voices) => {
          const voice = voices.at(voiceKey);
          if (voice) {
            resolve(voice);
          } else {
            reject(new Error('Voice not found for provided voiceKey.'));
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  continue() {
    console.log('Speech.chrome.continue');
    this.cancel();
    this.speak(this.text);
  }

  cancel() {
    console.log('synth.chrome.cancel');
    this.isCanceled = true;
    this.synth.stop();
  }

  pause() {
    console.log('synth.chrome.pause', this.text);
    this.synth.pause();
  }

  resume() {
    console.log('synth.chrome.resume', this.text);
    this.synth.resume();
  }

}
