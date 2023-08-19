/* eslint-disable no-bitwise */
export default function calcReadingTime(sections, rate) {
  const INTERVAL_SPEAKING_SERVICE_DELAY = 0;
  const INTERVAL_WORD = 0;
  if (rate <= 0) return 0;
  if (sections && sections.length) {
    const words = sections
      .map((section) =>
        section && section.text ? (section.text || '').split(' ').length : 0
      )
      .reduce((acc, val) => acc + val);

    const timeReadingWords = (words * INTERVAL_WORD) / rate;
    const timeDelayingSentences =
      INTERVAL_SPEAKING_SERVICE_DELAY * sections.length;
    return ~~((timeReadingWords + timeDelayingSentences) / 60);
  }
  return 0;
}
