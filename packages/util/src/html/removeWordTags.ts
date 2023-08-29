import { ATTRIBUTES, } from '@pericles/constants';

export default function removeWordTags(els: Element[]): void {
  els.forEach((section) => {
    const allWords = Array.from(
      section.querySelectorAll(`${ATTRIBUTES.TAGS.WORD}`)
    );
    allWords.forEach((word) => {
      word.replaceWith(document.createTextNode(word.textContent));
    });
    section.normalize();
  });
}
