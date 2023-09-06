import { getBrowserAPI, } from '@pericles/util';

import BaseSynth from './BaseSynth';
import ISynth from './ISynth';
import Utterance from './Utterance';

export default class ChromeSynth extends BaseSynth implements ISynth {

  private resumeTimer: any;

  private msg: any;

  private synth: any;

  private text: string;

  private currentMsgKey: number;

  private onEnd: any;

  private onResume: any;

  private onPause: any;

  private onWordsUpdate: any;

  private onStart: any;

  private onBoundary: any;

  private onBuffering: any;

  private isCanceled: boolean;

  private static voices: any;

  constructor() {
    super();
    this.synth = getBrowserAPI().api.tts;
    this.onStart = () => {};
    this.onEnd = () => {};
    this.onBoundary = () => {};
    this.onBuffering = () => {};
    this.onWordsUpdate = () => {};
    this.onPause = () => {};
    this.onResume = () => {};
    this.currentMsgKey = 0;
    this.msg = {};
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

  async speak(text: string): Promise<any> {
    this.isCanceled = false;
    this.text = text;
    const voiceObj = await this.getVoiceByKey(this.voice);

    console.log('voiceObj', voiceObj, this.voice);
    const ttsOptions = Utterance.getNew({
      lang: 'en',
      volume: this.volume,
      voice: voiceObj,
      pitch: this.pitch,
      rate: this.rate,
      text: this.text,
      onStart: (e: any) => {
        if (this.isCanceled) return;
        this.clearResumeInfinity();
        this.activateResumeInfinity();
        this.onBuffering({ buffering: false, });
        this.onStart(e);
      },
      onBoundary: (params: any) => {
        if (this.isCanceled) return;
        this.onBoundary(params);
      },
      onEnd: (e: any) => {
        if (this.isCanceled) return;
        this.clearResumeInfinity();
        this.onEnd(e);
      },
      onError: () => {
        if (this.isCanceled) return;
        this.onEnd({ continueSpeaking: true, });
      },
    });

    const { text: ttsText, ...restTtsOptions } = ttsOptions;
    getBrowserAPI().api.tts.speak(ttsText, restTtsOptions);
  }

  async getVoiceByKey(voiceKey: number) {
    return new Promise((resolve, reject) => {
      try {
        this.synth.getVoices((voices: any) => {
          resolve(voices[voiceKey]);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  static setVoices(voices: any) {
    console.log('voices', voices);
    ChromeSynth.voices = voices;
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
    this.clearResumeInfinity();
    // this.onPause();
  }

  resume() {
    console.log('synth.chrome.resume', this.text);
    this.synth.resume();
    this.activateResumeInfinity();
    // this.onResume();
  }

}
