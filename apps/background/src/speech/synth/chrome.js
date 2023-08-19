import Utterance from './utterance';

export default class ChromeSynth {

  constructor() {
    this.synth = window.speechSynthesis;
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

    this.msg = Utterance.getNew({
      lang: 'en',
      volume: this.volume,
      voice: voiceObj,
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
        // this.boundaries += Number(params.charIndex);
        this.onBoundary(
          params
          // charIndex: this.boundaries,
          // charLength: params.charLength,
        );
        // this.boundaries += params.charLength;
      },
      onEnd: (e) => {
        this.clearResumeInfinity();
        this.onEnd(e);
      },
      onPause: () => null,
      onResume: () => null,
      onError: () => this.onEnd({ continueSpeaking: true, }),
    });
    this.synth.speak(this.msg);
    // this.setBoundaries(boundaries);
    // const sentences = getSentencesFromText(text);
    // const texts = sentences.map((sentence) => sentence.text);
    // console.log('Chrome.speak.texts', { texts });
    // const voiceObj = await this.getVoiceByKey(this.voice);
    // console.log('voiceObj', voiceObj);

    // this.msgArr = texts.map((senText, i) =>
    //   Utterance.getNew({
    //     lang: 'en',
    //     volume: this.volume,
    //     voice: voiceObj,
    //     pitch: this.pitch,
    //     rate: this.rate,
    //     text: senText,
    //     onStart: (e) => {
    //       if (i === 0) this.onBuffering({ buffering: false });
    //       this.onStartS(i)(e);
    //     },
    //     onBoundary: (e) => {
    //       this.onBoundaryS(i)(e);
    //     },
    //     onEnd: (e) => {
    //       this.onEndS(i)(e);
    //     },
    //     onPause: () => null,
    //     onResume: () => null,
    //     onError: () => this.onEnd({ continueSpeaking: true }),
    //   })
    // );
    // if (this.msgArr[key]) this.synth.speak(this.msgArr[key]);
    // else this.onEnd({ continueSpeaking: true });
    // console.log('synth.speak.msgArr', this.msgArr);
    // const msg = new SpeechSynthesisUtterance(new Date().getTime());
    // const msg2 = new SpeechSynthesisUtterance('uniq shit');
    // msg.lang = 'en';
    // msg2.lang = 'en';
    // msg.volume = 1;
    // msg2.volume = 1;
    // msg.pitch = 1;
    // msg2.pitch = 1;
    // msg.text = `what the fuck is wrong with firefox`;
    // msg2.text = `Firefox is a great privacy browser`;
    // msg.rate = 1;
    // msg2.rate = 1;
    // console.log('this.synth', this.synth);
    // console.log('this.synth.msg', msg);
    // this.synth.cancel();
    // // this.synth.speak(msg2)
    // msg.onerror = (e) => {
    //   console.error('error mayday', e);
    // };

    // msg.onpause = (e) => {
    //   console.log('got paused, boss', e);
    // };
    // msg.onmark = (e) => {
    //   console.log('got mark, boss', e);
    // };
    // msg.onword = (e) => {
    //   console.log('got ord, boss', e);
    // };
    // msg.onstart = this.onStart;
    // msg.onend = this.onEnd;
    // msg.onboundary = this.onBoundary;

    /* eslint-disable-next-line */
    // window.speechSynthesis.speak(msg);
    // this.synth.speak(msg)
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
    this.synth.cancel();
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
