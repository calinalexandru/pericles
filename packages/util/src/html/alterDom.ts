import { NODE_TYPES, } from '@pericles/constants';

import isValidTag from '../predicates/isValidTag';

import alterNode from './alterNode';

export default function alterDom(el: Node, key: number) {
  if (!el?.childNodes?.length) return;
  el.childNodes.forEach((element: any) => {
    if (element.nodeType === NODE_TYPES.TEXT) {
      alterNode(element as Element, key);
    } else if (element.nodeType === NODE_TYPES.ELEMENT && isValidTag(element)) {
      alterDom(element as Node, key);
    }
  });
}
