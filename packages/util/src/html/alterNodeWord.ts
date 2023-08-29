import { ATTRIBUTES, } from '@pericles/constants';

export default function alterNodeWord(
  node: Element | Text,
  charIndex: number,
  charAudioIndex?: number
): void {
  if (!node) return;
  const myEl = document.createElement(ATTRIBUTES.TAGS.WORD);
  myEl.setAttribute(ATTRIBUTES.ATTRS.WORD, String(charIndex));
  if (charAudioIndex)
    myEl.setAttribute(ATTRIBUTES.ATTRS.WORD_AUDIO, String(charAudioIndex));
  node.after(myEl);
  myEl.appendChild(node);
}
