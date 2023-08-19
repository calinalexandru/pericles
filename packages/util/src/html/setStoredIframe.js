import { ATTRIBUTES, } from '@pericles/constants';

export default function setStoredIframe(node) {
  window[ATTRIBUTES.WINDOW.IFRAME_BUFFER] = node;
}
