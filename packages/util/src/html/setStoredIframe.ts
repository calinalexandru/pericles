import { ATTRIBUTES, } from '@pericles/constants';

export default function setStoredIframe(node: Node | null): void {
  (window as any)[ATTRIBUTES.WINDOW.IFRAME_BUFFER] = node;
}
