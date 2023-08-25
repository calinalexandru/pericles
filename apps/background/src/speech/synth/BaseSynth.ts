export default abstract class BaseSynth {

  constructor() {
    this.msgArr = [];
    this.volume = 1;
    this.pitch = 1;
    this.rate = 1;
    this.voice = 0;
  }

  clearMessages() {
    this.msgArr = [];
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
