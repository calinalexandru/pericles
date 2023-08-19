import { NODE_TYPES, } from '@pericles/constants';

export default function findTextNodes(elem) {
  return Array.from(elem.childNodes).filter(
    (node) => node.nodeType === NODE_TYPES.TEXT
  );
}
