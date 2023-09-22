const MIN_TEXT_LENGTH = 300;

export default function combineSmallSentences(
  sentences: { text: string }[]
): { text: string }[] {
  const combinedSentences: { text: string }[] = [];
  let tempText = '';

  for (const sentence of sentences) {
    tempText += `${sentence.text} `;
    if (tempText.length >= MIN_TEXT_LENGTH) {
      combinedSentences.push({ text: tempText.trim(), });
      tempText = '';
    }
  }

  if (tempText) {
    combinedSentences.push({ text: tempText.trim(), });
  }

  // console.log('combinedSentences', combinedSentences)

  return combinedSentences;
}
