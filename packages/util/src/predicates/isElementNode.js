import { NODE_TYPES, } from '@pericles/constants';

export default function isElementNode(el) {
  return el.nodeType === NODE_TYPES.ELEMENT;
}
