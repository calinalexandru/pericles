import { ATTRIBUTES, SectionType, } from '@pericles/constants';

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
  processElementNode,
  processTextNode,
  pushAndClearBuffer,
} from './util';

interface WalkTheDOMParams {
  node: HTMLElement;
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
  let nextNode: HTMLElement | null;
  let nextAfterIframe: HTMLElement | null;

  if (!isValidNode(node)) {
    return { out: pushAndClearBuffer(buffer, lastKey), blocked, };
  }

  if (
    isTextNode(node) &&
    isMinText(removeHTMLSpaces(getInnerText(node.nodeValue || ''))) &&
    determineVisibility(node, playFromCursor, userGenerated)
  ) {
    ({ nextNode, nextAfterIframe, } = processTextNode(
      node as unknown as Text,
      buffer,
      lastKey
    ));
    console.log('walkTheDom.node', nextNode);
  } else {
    ({ nextNode, nextAfterIframe, } = processElementNode(
      node,
      buffer,
      lastKey,
      playFromCursor,
      userGenerated
    ));
  }

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
