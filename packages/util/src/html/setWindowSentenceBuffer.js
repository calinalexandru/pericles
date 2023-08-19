import { ATTRIBUTES, } from '@pericles/constants';

export default function setWindowSentenceBuffer(params) {
  window[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] = params;
}
