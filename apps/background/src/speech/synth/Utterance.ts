/* eslint-disable-next-line no-undef */
export type UtteranceEvent = chrome.tts.TtsEvent;

type UtteranceOptions = {
  lang?: string;
  volume?: number;
  pitch?: number;
  rate?: number;
  /* eslint-disable-next-line no-undef */
  voice?: chrome.tts.TtsVoice;
  text: string;
  onStart?: (event: UtteranceEvent) => void;
  onEnd?: (event: UtteranceEvent) => void;
  onBoundary?: (event: UtteranceEvent) => void;
  onError?: (event: UtteranceEvent) => void;
};

type NewUtterance = {
  lang?: string;
  volume?: number;
  pitch?: number;
  rate?: number;
  voiceName?: string | undefined;
  text: string;
  onEvent?: (event: UtteranceEvent) => void;
};

export default class Utterance {

  static getNew(options: UtteranceOptions): NewUtterance {
    console.log('Utterance.getNew.options', options);
    const {
      lang,
      volume,
      pitch,
      rate,
      voice,
      onStart,
      text,
      onEnd,
      onBoundary,
      onError,
    } = options;

    return {
      lang,
      volume,
      pitch,
      rate,
      voiceName: voice ? voice.voiceName : undefined,
      text,
      onEvent: (event: UtteranceEvent) => {
        console.log('Utterance.onEvent.typez', event.type, event);
        switch (event.type) {
        case 'start':
          if (onStart) onStart(event);
          break;
        case 'word':
          if (onBoundary) onBoundary(event);
          break;
        case 'end':
          if (onEnd) onEnd(event);
          break;
        case 'interrupted':
        case 'cancelled':
        case 'error':
          if (onError) onError(event);
          break;
        default:
          break;
        }
      },
    };
  }

}
