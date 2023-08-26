import { ATTRIBUTES, } from '@pericles/constants';

import canAccessIframe from '../helpers/canAccessIframe';
import getIframeDocument from '../helpers/getIframeDocument';

export default function findNextSibling(
  el: Node | Element,
  withParents: boolean = false,
  accessIframe: boolean = true
): any {
  console.log('findNextSibling', { el, withParents, accessIframe, });
  let nextSibling: any = el;
  const parents = [];
  if (
    nextSibling.tagName === 'IFRAME' &&
    accessIframe &&
    nextSibling.getAttribute('id') !== ATTRIBUTES.ATTRS.CONTENT_IFRAME
  ) {
    if (canAccessIframe(nextSibling)) {
      const [ nextIframeSibling, ] =
        getIframeDocument(nextSibling)?.body?.childNodes || [];
      if (nextIframeSibling) {
        return withParents
          ? {
            next: nextIframeSibling,
            nextAfterIframe: findNextSibling(nextSibling, false, false),
            parents,
          }
          : nextIframeSibling;
      }
    } else {
      nextSibling = findNextSibling(nextSibling, false, false);
      return withParents ? { next: nextSibling, parents, } : nextSibling;
    }
  }

  while (
    nextSibling &&
    nextSibling.parentNode &&
    nextSibling.nextSibling === null
  ) {
    nextSibling = nextSibling.parentNode;
    parents.push(nextSibling);
  }
  return withParents
    ? { next: nextSibling && nextSibling.nextSibling, parents, }
    : nextSibling && nextSibling.nextSibling;
}
