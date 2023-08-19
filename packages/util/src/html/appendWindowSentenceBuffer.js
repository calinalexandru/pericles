import { ATTRIBUTES, } from '@pericles/constants';

export default function appendWindowSentenceBuffer({
  top,
  width,
  height,
  ...rest
}) {
  const { text = '', } = window[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] || {};
  window[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] = {
    text: text + rest.text,
    top,
    width,
    height,
  };
}
