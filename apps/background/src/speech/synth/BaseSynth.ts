export default abstract class BaseSynth {

  public msgArr: string[];

  public volume: number;

  public pitch: number;

  public rate: number;

  public voice: number;

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

  setVoice(val: number) {
    this.voice = val;
  }

  setVolume(val: number) {
    this.volume = val;
  }

  setPitch(val: number) {
    this.pitch = val;
  }

  setRate(val: number) {
    this.rate = val;
  }

  isReplayStarved(settings: any) {
    return true;
  }

  getSeekerTime() {
    return 0;
  }

  seek(time: number) {
    //
  }

}
