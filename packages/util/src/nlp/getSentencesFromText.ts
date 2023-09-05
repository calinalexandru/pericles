import nlp from 'compromise/one';

export default function getSentencesFromText(text: string): string | undefined {
  return nlp(text).json();
}
