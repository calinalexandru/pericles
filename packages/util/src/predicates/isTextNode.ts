import { NODE_TYPES, } from '@pericles/constants';

export default function isTextNode(node: HTMLElement) {
  return node.nodeType === NODE_TYPES.TEXT;
}
