import { ATTRIBUTES, } from '@pericles/constants';

export default function getWindowSentenceBuffer(): {
  text: string;
  } {
  return window[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] || { text: '', };
}
