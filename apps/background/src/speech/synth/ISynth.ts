export default interface ISynth {
  speak(text: string): Promise<any>;
  resume(): void;
  pause(): void;
}
