import { NODE_TYPES, } from '@pericles/constants';

// should only accept node type
export default function isTextNode(node) {
  return node.nodeType === NODE_TYPES.TEXT;
}
