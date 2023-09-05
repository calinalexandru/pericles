import { ATTRIBUTES, } from '@pericles/constants';

export default function getWindowSentenceBuffer(): {
  text?: string;
  top?: number;
  width?: number;
  height?: number;
  } {
  return (
    (window as any)[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] || {
      text: '',
      top: 0,
      width: 0,
      height: 0,
    }
  );
}
