import isHTMLElement from '../predicates/isHtmlElement';
import isTextNode from '../predicates/isTextNode';
import isValidTag from '../predicates/isValidTag';

import alterNode from './alterNode';

export default function alterDom(el: Node, key: number) {
  if (!el?.childNodes?.length) return;
  el.childNodes.forEach((element: Node) => {
    if (isTextNode(element)) {
      alterNode(element, key);
    } else if (isHTMLElement(element) && isValidTag(element)) {
      alterDom(element, key);
    }
  });
}
