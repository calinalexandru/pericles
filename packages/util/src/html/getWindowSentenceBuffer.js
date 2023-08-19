import { ATTRIBUTES, } from '@pericles/constants';

export default function getWindowSentenceBuffer() {
  return window[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] || {};
}
