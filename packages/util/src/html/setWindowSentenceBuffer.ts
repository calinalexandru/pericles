import { ATTRIBUTES, } from '@pericles/constants';

export default function setWindowSentenceBuffer(params: any): void {
  (window as any)[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] = params;
}
