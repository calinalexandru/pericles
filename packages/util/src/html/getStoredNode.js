import { ATTRIBUTES, } from '@pericles/constants';

import getLastNode from './getLastNode';

export default function getStoredNode() {
  return window[ATTRIBUTES.WINDOW.NODE_BUFFER] || getLastNode();
}
