import nlp from 'compromise/one';

export default function getSentencesFromText(text: string): string {
  return nlp(text).json();
}
