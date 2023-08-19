import { ATTRIBUTES, } from '@pericles/constants';

import getLastNode from './getLastNode';

export default function getStoredIframe() {
  return window[ATTRIBUTES.WINDOW.IFRAME_BUFFER];
}
