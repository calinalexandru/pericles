type UtteranceEvent = {
  type:
    | 'start'
    | 'word'
    | 'end'
    | 'interrupted'
    | 'cancelled'
    | 'error'
    | 'marker'
    | 'sentence'
    | 'pause'
    | 'resume';
};

type UtteranceOptions = {
  lang?: string;
  volume?: number;
  pitch?: number;
  rate?: number;
  voice?: any;
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
