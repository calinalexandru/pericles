import { ATTRIBUTES, SectionType, } from '@pericles/constants';

import isElementNode from '../../predicates/isElementNode';
import isMinText from '../../predicates/isMinText';
import isTextNode from '../../predicates/isTextNode';
import isValidNode from '../../predicates/isValidNode';
import getInnerText from '../../string-work/getInnerText';
import getStoredIframe from '../getStoredIframe';
import removeHTMLSpaces from '../removeHTMLSpaces';
import setStoredIframe from '../setStoredIframe';
import setStoredNode from '../setStoredNode';

import {
  determineVisibility,
  processAnyNode,
  processElementNode,
  processTextNode,
  pushAndClearBuffer,
  validateElementNode,
} from './util';

interface WalkTheDOMParams {
  node: Node;
  buffer: SectionType[];
  lastKey: number;
  userGenerated: boolean;
  playFromCursor: number;
  callStackCounter?: number;
  blocked?: boolean;
}

interface WalkTheDOMResult {
  out: SectionType[];
  blocked: boolean;
}

export default function walkTheDOM({
  node,
  buffer,
  lastKey,
  userGenerated,
  playFromCursor,
  callStackCounter = 0,
  blocked = false,
}: WalkTheDOMParams): WalkTheDOMResult {
  console.log('walkTheDOM', {
    node,
    buffer,
    lastKey,
    userGenerated,
    playFromCursor,
    callStackCounter,
    blocked,
  });
  let nextNode: Node | null;
  let nextAfterIframe: Node | null;

  if (!isValidNode(node)) {
    return { out: pushAndClearBuffer(buffer, lastKey), blocked, };
  }

  if (
    isTextNode(node) &&
    determineVisibility(node, playFromCursor, userGenerated) &&
    isMinText(removeHTMLSpaces(getInnerText(node.nodeValue || '')))
  ) {
    ({ nextNode, nextAfterIframe, } = processTextNode(node, buffer, lastKey));
  } else if (
    isElementNode(node) &&
    determineVisibility(node, playFromCursor, userGenerated) &&
    validateElementNode(node)
  ) {
    ({ nextNode, nextAfterIframe, } = processElementNode(node, buffer, lastKey));
  } else {
    ({ nextNode, nextAfterIframe, } = processAnyNode(
      node,
      playFromCursor,
      userGenerated
    ));
  }
  console.log('walkTheDom.node', nextNode);

  if (callStackCounter >= ATTRIBUTES.MISC.MAX_RECURSION_STACK_CALL) {
    console.warn('walkTheDom.callstack exceeded');
    setStoredNode(nextNode);
    return {
      out: pushAndClearBuffer(buffer, lastKey),
      blocked,
    };
  }

  if (!nextNode && getStoredIframe()) {
    nextNode = getStoredIframe();
    setStoredIframe(null);
    console.log('walkTheDom.fromIframe', nextNode);
  }

  if (nextAfterIframe && !getStoredIframe()) {
    console.log('storing another iframe');
    setStoredIframe(nextAfterIframe);
    nextAfterIframe = null;
  }

  if (!blocked && nextNode && buffer.length < ATTRIBUTES.MISC.MIN_SECTIONS) {
    walkTheDOM({
      buffer,
      node: nextNode,
      lastKey,
      userGenerated,
      playFromCursor,
      callStackCounter: callStackCounter + 1,
      blocked,
    });
  }

  return {
    out: pushAndClearBuffer(buffer, lastKey),
    blocked,
  };
}
