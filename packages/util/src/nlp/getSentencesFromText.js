import nlp from 'compromise/one';

export default function getSentencesFromText(text) {
  return nlp(text).json();
}
