export default class Utterance {

  static getNew({
    lang,
    volume,
    pitch,
    rate,
    voice,
    onStart,
    text,
    onEnd,
    onBoundary,
    onPause,
    onResume,
    onError,
  }) {
    return {
      lang,
      volume,
      pitch,
      rate,
      voiceName: voice ? voice.voiceName : undefined,
      text,
      onEvent: (event) => {
        switch (event.type) {
        case 'start':
          onStart(event);
          break;
        case 'word':
          onBoundary(event);
          break;
        case 'end':
          onEnd(event);
          break;
        case 'interrupted':
        case 'cancelled':
        case 'error':
          onError(event);
          break;
        default:
          break;
        }
      },
    };
  }

}
