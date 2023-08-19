/* eslint-disable no-bitwise */
import { ATTRIBUTES, } from '@pericles/constants';

import getSentencesFromText from '../nlp/getSentencesFromText';
import isElementNode from '../predicates/isElementNode';
import isHeading from '../predicates/isHeading';
import isMaxText from '../predicates/isMaxText';
import isMinText from '../predicates/isMinText';
import isParagraph from '../predicates/isParagraph';
import isSkippableByDesign from '../predicates/isSkippableByDesign';
import isTextNode from '../predicates/isTextNode';
import isValidNode from '../predicates/isValidNode';
import isValidTag from '../predicates/isValidTag';
import isWikipedia from '../predicates/isWikipedia';
import getInnerText from '../string-work/getInnerText';

import alterDom from './alterDom';
import alterNode from './alterNode';
import appendWindowSentenceBuffer from './appendWindowSentenceBuffer';
import findNextSibling from './findNextSibling';
import getSelfIframes from './getSelfIframes';
import getStoredIframe from './getStoredIframe';
import getWindowSentenceBuffer from './getWindowSentenceBuffer';
import hasChildNodes from './hasChildNodes';
import isVisible from './isVisible';
import isVisibleNode from './isVisibleNode';
import removeHelperTags from './removeHelperTags';
import removeHTMLSpaces from './removeHTMLSpaces';
import sectionQuerySelector from './sectionQuerySelector';
import setStoredIframe from './setStoredIframe';
import setStoredNode from './setStoredNode';
import setWindowSentenceBuffer from './setWindowSentenceBuffer';

const pushSection = (buffer, node, text) => {
  console.log('pushSection', { buffer, node, text, });
  const {
    top = 0,
    width = 0,
    height = 0,
  } = node?.getBoundingClientRect?.() || {};
  const { y: adjustY = 0, } =
    node?.ownerDocument?.defaultView?.frameElement?.getBoundingClientRect?.() ||
    {};
  buffer.push({
    node,
    text,
    pos: {
      top: ~~top + ~~window.scrollY + ~~adjustY,
      width: ~~width,
      height: ~~height,
    },
  });
  return buffer;
};

const pushNode = (text, node) => {
  const {
    top = 0,
    width = 0,
    height = 0,
  } = node?.parentElement?.getBoundingClientRect?.() || {};
  const { y: adjustY = 0, } =
    node?.ownerDocument?.defaultView?.frameElement?.getBoundingClientRect?.() ||
    {};
  const outer = {
    text,
    top: ~~top + ~~window.scrollY + ~~adjustY,
    width: ~~width,
    height: ~~height,
  };
  appendWindowSentenceBuffer(outer);
};

const pushAndClearBuffer = (buffer, lastKey) => {
  console.log('pushAndClearBuffer', { buffer, lastKey, });
  if (getWindowSentenceBuffer()?.text?.length) {
    if (isMinText(getWindowSentenceBuffer()?.text)) {
      const { text, top, width, height, } = getWindowSentenceBuffer();
      buffer.push({ text, pos: { top, width, height, }, });
    } else {
      const nodesInFrame = getSelfIframes().reduce(
        (acc, iframe) => [
          ...acc,
          ...Array.from(
            iframe.document.querySelectorAll(
              sectionQuerySelector(lastKey + buffer.length)
            )
          ),
        ],
        []
      );
      removeHelperTags(
        Array.from(
          document.querySelectorAll(
            sectionQuerySelector(lastKey + buffer.length)
          )
        )
      );
      if (nodesInFrame.length) removeHelperTags(nodesInFrame);
    }
    setWindowSentenceBuffer({});
  }
  return buffer;
};

export default function walkTheDOM({
  node,
  buffer,
  lastKey,
  userGenerated,
  playFromCursor,
  callStackCounter = 0,
  blocked = false,
}) {
  console.log('walkTheDOM', {
    hostname: window.location.hostname,
    node,
    buffer,
    lastKey,
    userGenerated,
    playFromCursor,
    callStackCounter,
  });
  let nextNode;
  let nextAfterIframe;
  if (!isValidNode(node)) {
    return pushAndClearBuffer(buffer, lastKey);
  }

  if (
    isTextNode(node) &&
    isMinText(removeHTMLSpaces(getInnerText(node.nodeValue))) &&
    isVisibleNode({ window, node, playFromCursor, })
  ) {
    let next;
    let parents;
    let firstParagraph = false;
    if (isMaxText(removeHTMLSpaces(getInnerText(node.nodeValue)))) {
      [ firstParagraph = {}, ] = getSentencesFromText(node.nodeValue);
      parents = [];
      next = node.splitText(
        firstParagraph && node.nodeValue.length >= firstParagraph.text.length
          ? firstParagraph.text.length
          : ~~(node.nodeValue.length / 2)
      );
    } else {
      ({ next, parents, nextAfterIframe, } = findNextSibling(node, true));
    }
    const nodeText = getInnerText(node.nodeValue);
    pushNode(nodeText, node);
    alterNode(node, lastKey + buffer.length);
    if (firstParagraph || (parents.length && parents[0].tagName !== 'A')) {
      pushAndClearBuffer(buffer, lastKey);
    }
    nextNode = next;
  } else {
    const isVisibleNodeOrText = isTextNode(node)
      ? isVisibleNode({ window, node, fromY: playFromCursor, })
      : isVisible({
        window,
        el: node,
        inViewport: userGenerated,
        fromY: playFromCursor,
      });
    const isValidElement =
      isElementNode(node) &&
      isValidTag(node) &&
      isMinText(
        removeHTMLSpaces(getInnerText(node.innerText || node.textContent))
      );
    const isTypePara =
      isVisibleNodeOrText &&
      (isParagraph(node) ||
        isHeading(node) ||
        (!hasChildNodes(node) &&
          isMinText(getInnerText(node.innerText || node.textContent))));
    if (isValidElement && isTypePara) {
      pushAndClearBuffer(buffer, lastKey);
      alterDom(node, lastKey + buffer.length);
      pushSection(
        buffer,
        node,
        getInnerText(node.innerText || node.textContent)
      );
      ({ next: nextNode, nextAfterIframe, } = findNextSibling(node, true));
    } else {
      ({ next: nextNode, nextAfterIframe, } =
        isElementNode(node) &&
        ((isWikipedia() && isSkippableByDesign(node)) ||
          !isValidTag(node) ||
          !isVisible({
            window,
            el: node,
            inViewport: userGenerated,
            fromY: playFromCursor,
          }))
          ? findNextSibling(node, true)
          : (node.childNodes[0] && { next: node.childNodes[0], }) ||
            findNextSibling(node, true));
    }
  }
  // console.log('walkTheDom.nextAfterIframe', getStoredIframe());

  if (callStackCounter >= ATTRIBUTES.MISC.MAX_RECURSION_STACK_CALL) {
    console.warn('walkTheDom.callstack exceeded');
    setStoredNode(nextNode);
    return {
      out: pushAndClearBuffer(buffer, lastKey),
      blocked,
    };
  }

  // we cant get out of the iframe
  // use our recorder variable to do that
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

  // console.log('walkTheDom.nextNode', nextNode);

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
