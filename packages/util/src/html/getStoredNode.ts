import { ATTRIBUTES, } from '@pericles/constants';

import getLastNode from './getLastNode';

export default function getStoredNode(): HTMLElement {
  return (window as any)[ATTRIBUTES.WINDOW.NODE_BUFFER] || getLastNode();
}
