export default interface ISynth {
  speak(text: string): Promise<void>;
  resume(): void;
  pause(): void;
}
