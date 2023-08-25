export default interface ISynth {
  play(text: string): void;
  resume(): void;
  pause(): void;
}
