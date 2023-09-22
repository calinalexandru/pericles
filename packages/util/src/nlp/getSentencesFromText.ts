import nlp from 'compromise/one';

export default function getSentencesFromText(
  text: string
): { text: string }[] | undefined {
  const out = nlp(text).json();
  console.log('getSentencesFromText', text, out);
  return out;
}
