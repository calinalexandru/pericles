import { ATTRIBUTES, } from '@pericles/constants';

import canAccessIframe from '../helpers/canAccessIframe';
import getIframeDocument from '../helpers/getIframeDocument';

type Siblings = {
  iframeBlocked: boolean;
  next: Node | null;
  nextAfterIframe: Node | null;
};

/**
 * Retrieves the first child node from an iframe's document body.
 * Returns null if unable to access the iframe's content.
 * @param {HTMLIFrameElement} iframe - The iframe element to inspect.
 * @returns {Node | null} - The first child node or null.
 */
function findNextSiblingInIframe(iframe: HTMLIFrameElement): Node | null {
  if (canAccessIframe(iframe)) {
    return getIframeDocument(iframe)?.body?.firstChild || null;
  }
  return null;
}

/**
 * Navigates upwards in the DOM tree to find the next sibling.
 * It goes up until a sibling is found or there are no more parent nodes.
 * @param {Node} el - The starting node.
 * @returns {Node | null} - The next sibling node or null.
 */
function findImmediateSibling(el: Node): Node | null {
  let nextSibling: Node | null = el;
  while (nextSibling && nextSibling.parentNode && !nextSibling.nextSibling) {
    nextSibling = nextSibling.parentNode;
  }
  return nextSibling?.nextSibling || null;
}

/**
 * Retrieves the next sibling node within an iframe, or the sibling
 * outside if there's no accessible content inside the iframe.
 * @param {HTMLIFrameElement} el - The iframe element.
 * @returns {Node | null} - The sibling node or null.
 */
function getNextSiblingFromIframe(el: HTMLIFrameElement): {
  node: Node | null;
  iframeBlocked: boolean;
} {
  const nextIframeSibling = findNextSiblingInIframe(el);
  if (nextIframeSibling) {
    return { node: nextIframeSibling, iframeBlocked: false, };
  }
  return findNextSibling(el, false, true);
}

/**
 * Finds the next sibling of a node. For iframes, it checks if it's allowed to
 * access its content and retrieves the first child node from within.
 * @param {Node} el - The starting node.
 * @param {boolean} accessIframe - Whether to look inside iframes.
 * @returns {Node | null} - The next sibling node or null.
 */
export function findNextSibling(
  el: Node,
  accessIframe: boolean = true,
  previousIframeBlocked: boolean = false
): { node: Node | null; iframeBlocked: boolean } {
  if (previousIframeBlocked === true) {
    return {
      node: el,
      iframeBlocked: true,
    };
  }

  if (
    accessIframe &&
    el instanceof HTMLIFrameElement &&
    el.getAttribute('id') !== ATTRIBUTES.ATTRS.CONTENT_IFRAME
  ) {
    return getNextSiblingFromIframe(el);
  }

  return { node: findImmediateSibling(el), iframeBlocked: false, };
}

/* *
 * Finds the next sibling of a node and gathers all of its parent nodes.
 * For iframes, it retrieves the sibling both inside and outside the iframe.
 * @param {Node} el - The starting node.
 * @param {boolean} accessIframe - Whether to look inside iframes.
 * @returns {Siblings} - An object containing the sibling and the next iframe sibling.
 */
export function findNextSiblingWithIframe(
  el: Node,
  accessIframe: boolean = true
): Siblings {
  let nextAfterIframe: Node | null = null;
  const { node: sibling, iframeBlocked, } = findNextSibling(el, accessIframe);
  if (accessIframe === true && iframeBlocked) {
    if (sibling instanceof Node) {
      ({ node: nextAfterIframe, } = findNextSibling(sibling, false));
    }
    return { iframeBlocked: true, next: sibling, nextAfterIframe, };
  }
  if (sibling instanceof HTMLIFrameElement) {
    ({ node: nextAfterIframe, } = findNextSibling(sibling, false));
  }
  return { iframeBlocked: false, next: sibling, nextAfterIframe, };
}
