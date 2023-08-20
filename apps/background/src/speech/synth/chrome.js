import { getBrowserAPI, } from '@pericles/util';

import Utterance from './utterance';

export default class ChromeSynth {

  constructor() {
    this.synth = getBrowserAPI().api.tts;
    this.onStart = () => {};
    this.onEnd = () => {};
    this.onBoundary = () => {};
    this.onBuffering = () => {};
    this.onWordsUpdate = () => {};
    this.onPause = () => {};
    this.onResume = () => {};
    this.currentMsgKey = 0;
    this.volume = 1;
    this.pitch = 1;
    this.rate = 1;
    this.voice = 0;
    this.voices = [];
    this.msgArr = [];
    this.msg = {};
    this.text = '';
    this.boundaries = 0; // [];
    this.serviceKey = '';
    this.serviceRegion = '';
    this.resumeTimer = 0;
    this.isCanceled = false;
  }

  clearMessages() {
    this.msgArr = [];
  }

  setBoundaries(boundaries) {
    this.boundaries = boundaries;
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

  async speak(text, key = 0, boundaries = []) {
    this.isCanceled = false;
    console.log('speak', text, key);
    this.setBoundaries(boundaries);
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
      onStart: (e) => {
        if (this.isCanceled) return;
        this.clearResumeInfinity();
        this.activateResumeInfinity();
        this.onBuffering({ buffering: false, });
        this.onStart(e);
      },
      onBoundary: (params) => {
        if (this.isCanceled) return;
        this.onBoundary(params);
      },
      onEnd: (e) => {
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

  setVoice(val) {
    this.voice = val;
  }

  setVolume(val) {
    this.volume = val;
  }

  setPitch(val) {
    this.pitch = val;
  }

  setRate(val) {
    this.rate = val;
  }

  async getVoiceByKey(voiceKey) {
    return new Promise((resolve, reject) => {
      try {
        this.synth.getVoices((voices) => {
          resolve(voices[voiceKey]);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  static setVoices(voices) {
    console.log('voices', voices);
    ChromeSynth.voices = voices;
  }

  continue() {
    console.log('Speech.chrome.continue');
    this.cancel();
    this.speak(this.text, this.currentMsgKey + 1, this.boundaries);
  }

  cancel() {
    console.log('synth.chrome.cancel');
    this.isCanceled = true;
    this.synth.stop();
  }

  pause() {
    console.log('synth.chrome.pause', this.msgArr);
    this.synth.pause();
    // this.onPause();
  }

  resume() {
    console.log('synth.chrome.resume', this.msgArr);
    this.synth.resume();
    // this.onResume();
  }

  setServiceRegion(region) {
    this.serviceRegion = region;
  }

  setServiceKey(key) {
    this.serviceKey = key;
  }

  isReplayStarved() {
    return true;
  }

  getSeekerTime() {
    return 0;
  }

  seek() {
    //
  }

}

ChromeSynth.voices = [];
