import { ATTRIBUTES, } from '@pericles/constants';

export default function setStoredIframe(node: Node): void {
  window[ATTRIBUTES.WINDOW.IFRAME_BUFFER] = node;
}
