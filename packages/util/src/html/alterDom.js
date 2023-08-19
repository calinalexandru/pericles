import { NODE_TYPES, } from '@pericles/constants';

import isValidTag from '../predicates/isValidTag';

import alterNode from './alterNode';

export default function alterDom(el, key) {
  if (!el?.childNodes?.length) return;
  el.childNodes.forEach((element) => {
    if (element.nodeType === NODE_TYPES.TEXT) {
      alterNode(element, key);
    } else if (element.nodeType === NODE_TYPES.ELEMENT && isValidTag(element)) {
      alterDom(element, key);
    }
  });
}
