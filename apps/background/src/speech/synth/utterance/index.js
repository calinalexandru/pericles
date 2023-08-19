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
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    msg.onstart = onStart;
    msg.onend = onEnd;
    msg.onboundary = onBoundary;
    msg.onpause = onPause;
    msg.onresume = onResume;
    msg.onerror = onError;
    msg.volume = volume;
    msg.pitch = pitch;
    msg.text = text;
    msg.rate = rate;
    msg.voice = voice;
    // msg.addEventListener('start', onStart);
    // msg.addEventListener('end', onEnd);
    // msg.addEventListener('boundary', onBoundary);
    return msg;
  }

}
