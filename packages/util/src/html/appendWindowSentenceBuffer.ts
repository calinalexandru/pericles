import { ATTRIBUTES, } from '@pericles/constants';

export default function appendWindowSentenceBuffer({
  top,
  width,
  height,
  text,
}: {
  top: number;
  width: number;
  height: number;
  text: string;
}): void {
  const { text: bufferText = '', } =
    (window as any)[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] || {};
  (window as any)[ATTRIBUTES.WINDOW.SENTENCE_BUFFER] = {
    text: bufferText + text,
    top,
    width,
    height,
  };
}
