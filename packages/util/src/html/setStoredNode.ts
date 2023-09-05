import { ATTRIBUTES, } from '@pericles/constants';

export default function setStoredNode(node: Node | null): void {
  (window as any)[ATTRIBUTES.WINDOW.NODE_BUFFER] = node;
}
