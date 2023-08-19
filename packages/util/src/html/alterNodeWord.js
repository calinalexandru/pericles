import { ATTRIBUTES, } from '@pericles/constants';

export default function alterNodeWord(node, charIndex, charAudioIndex) {
  if (!node) return;
  const myEl = document.createElement(ATTRIBUTES.TAGS.WORD);
  myEl.setAttribute(ATTRIBUTES.ATTRS.WORD, charIndex);
  if (charAudioIndex)
    myEl.setAttribute(ATTRIBUTES.ATTRS.WORD_AUDIO, charAudioIndex);
  node.after(myEl);
  myEl.appendChild(node);
}
