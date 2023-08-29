import { ATTRIBUTES, } from '@pericles/constants';

export default function setStoredNode(node: Node): void {
  window[ATTRIBUTES.WINDOW.NODE_BUFFER] = node;
}
