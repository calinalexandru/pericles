import { ATTRIBUTES, } from '@pericles/constants';

export default function setWindowSentenceBuffer(params: any): void {
  window[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] = params;
}
