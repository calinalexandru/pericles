import { ATTRIBUTES, } from '@pericles/constants';

export default function getStoredIframe(): HTMLElement | null {
  return window[ATTRIBUTES.WINDOW.IFRAME_BUFFER];
}
