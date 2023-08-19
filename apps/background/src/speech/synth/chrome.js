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

  // onStartS(index) {
  //   // reset timer to zero, start couting time
  //   this.currentMsgKey = index;
  //   this.clearResumeInfinity();
  //   this.activateResumeInfinity();
  //   return (params) => {
  //     // console.log('onStart', index, params);
  //     this.onStart({ ...params, index });
  //   };
  // }

  // onBoundaryS(index) {
  //   return (params) => {
  //     if (index === 0) {
  //       this.onBoundary(params);
  //       this.boundaries[index] = params.charIndex + params.charLength;
  //     } else {
  //       this.boundaries[index] = this.boundaries[index - 1] + params.charIndex;
  //       this.onBoundary({
  //         charIndex: this.boundaries[index],
  //         charLength: params.charLength,
  //       });
  //       this.boundaries[index] =
  //         this.boundaries[index - 1] + params.charIndex + params.charLength;
  //     }
  //   };
  // }

  // onEndS(index) {
  //   this.currentMsgKey = index;
  //   this.clearResumeInfinity();
  //   return (params) => {
  //     const nextMsg = this.msgArr[index + 1];
  //     console.log('synth.chrone,onEndS.nextMsg', nextMsg);
  //     console.log('synth.chrome.onEndS', index, params);
  //     if (nextMsg) this.synth.speak(nextMsg);
  //     else this.onEnd(params);
  //   };
  // }

  async speak(text, key = 0, boundaries = []) {
    console.log('speak', text, key);
    this.setBoundaries(boundaries);
    this.text = text;
    const voiceObj = await this.getVoiceByKey(this.voice);

    const ttsOptions = Utterance.getNew({
      lang: 'en',
      volume: this.volume,
      voice: voiceObj, // Assuming voiceObj has a voiceName property that matches one from chrome.tts.getVoices
      pitch: this.pitch,
      rate: this.rate,
      text: this.text,
      onStart: (e) => {
        this.clearResumeInfinity();
        this.activateResumeInfinity();
        this.onBuffering({ buffering: false, });
        this.onStart(e);
      },
      onBoundary: (params) => {
        this.onBoundary(params);
      },
      onEnd: (e) => {
        this.clearResumeInfinity();
        this.onEnd(e);
      },
      onError: () => this.onEnd({ continueSpeaking: true, }),
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
        const voices = this.synth.getVoices();
        resolve(voices[voiceKey]);
      } catch (e) {
        reject();
      }
    });
  }

  static setVoices(voices) {
    console.log('voices', voices);
    ChromeSynth.voices = voices;
  }

  removeListeners() {
    console.log('synth.chrome.removeListeners');
    this.clearResumeInfinity();
    this.msg.onstart = () => {};
    this.msg.onend = () => {};
    this.msg.onboundary = () => {};
    this.msg.onerror = () => {};
    // this.msgArr.forEach((arr, i) => {
    //   this.msgArr[i].onstart = () => {};
    //   this.msgArr[i].onend = () => {};
    //   this.msgArr[i].onboundary = () => {};
    // });
  }

  continue() {
    console.log('Speech.chrome.continue');
    this.cancel();
    this.speak(this.text, this.currentMsgKey + 1, this.boundaries);
  }

  cancel() {
    console.log('synth.chrome.cancel');
    this.removeListeners();
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
