import { ATTRIBUTES, } from '@pericles/constants';

export default function setStoredIframe(node: HTMLElement | null): void {
  (window as any)[ATTRIBUTES.WINDOW.IFRAME_BUFFER] = node;
}
