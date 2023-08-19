import { ATTRIBUTES, } from '@pericles/constants';

export default function setStoredNode(node) {
  window[ATTRIBUTES.WINDOW.NODE_BUFFER] = node;
}
