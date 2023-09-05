import { ATTRIBUTES, } from '@pericles/constants';

export default function getStoredIframe(): HTMLElement | null {
  return (window as any)[ATTRIBUTES.WINDOW.IFRAME_BUFFER];
}
