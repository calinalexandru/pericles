import { ATTRIBUTES, } from '@pericles/constants';

export default function getStoredIframe(): Element | null {
  return window[ATTRIBUTES.WINDOW.IFRAME_BUFFER];
}
