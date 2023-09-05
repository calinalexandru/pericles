import { SectionType, } from '@pericles/constants';

import getSentencesFromText from '../../nlp/getSentencesFromText';
import isHeading from '../../predicates/isHeading';
import isMaxText from '../../predicates/isMaxText';
import isMinText from '../../predicates/isMinText';
import isParagraph from '../../predicates/isParagraph';
import isSkippableByDesign from '../../predicates/isSkippableByDesign';
import isTextNode from '../../predicates/isTextNode';
import isValidTag from '../../predicates/isValidTag';
import isWikipedia from '../../predicates/isWikipedia';
import getInnerText from '../../string-work/getInnerText';
import alterDom from '../alterDom';
import alterNode from '../alterNode';
import appendWindowSentenceBuffer from '../appendWindowSentenceBuffer';
import findNextSibling from '../findNextSibling';
import getSelfIframes from '../getSelfIframes';
import getWindowSentenceBuffer from '../getWindowSentenceBuffer';
import hasChildNodes from '../hasChildNodes';
import isVisible from '../isVisible';
import isVisibleNode from '../isVisibleNode';
import removeHelperTags from '../removeHelperTags';
import removeHTMLSpaces from '../removeHTMLSpaces';
import sectionQuerySelector from '../sectionQuerySelector';
import setWindowSentenceBuffer from '../setWindowSentenceBuffer';

type Position = {
  top: number;
  width: number;
  height: number;
};

const getPosition = (
  node: Element | HTMLElement | Text,
  relativeToParent = false
): Position => {
  const element: Element =
    relativeToParent && node?.parentElement
      ? (node.parentElement as Element)
      : (node as Element);
  const {
    top = 0,
    width = 0,
    height = 0,
  } = element?.getBoundingClientRect?.() || {};
  const { y: adjustY = 0, } =
    node?.ownerDocument?.defaultView?.frameElement?.getBoundingClientRect?.() ||
    {};
  return {
    top: Math.floor(top) + Math.floor(window.scrollY) + Math.floor(adjustY),
    width: Math.floor(width),
    height: Math.floor(height),
  };
};

export const pushSection = (
  buffer: SectionType[],
  node: HTMLElement,
  text: string
): SectionType[] => {
  const pos = getPosition(node);
  buffer.push({ node, text, pos, });
  return buffer;
};

export const pushAndClearBuffer = (
  buffer: SectionType[],
  lastKey: number
): SectionType[] => {
  //   console.log('pushAndClearBuffer', { buffer, lastKey, });
  if (getWindowSentenceBuffer()?.text?.length) {
    if (isMinText(getWindowSentenceBuffer()?.text || '')) {
      const { text, top, width, height, } = getWindowSentenceBuffer();
      buffer.push({ text, pos: { top, width, height, }, } as SectionType);
    } else {
      const nodesInFrame: HTMLElement[] = getSelfIframes().reduce(
        (acc, iframe) => [
          ...acc,
          ...Array.from(
            iframe.document.querySelectorAll<HTMLElement>(
              sectionQuerySelector(lastKey + buffer.length)
            )
          ),
        ],
        [] as HTMLElement[]
      );
      removeHelperTags(
        Array.from(
          document.querySelectorAll<HTMLElement>(
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

export const determineVisibility = (
  node: HTMLElement,
  playFromCursor: number,
  userGenerated: boolean
): boolean =>
  isTextNode(node)
    ? isVisibleNode({ window, node, fromCursorY: playFromCursor, })
    : isVisible({
      window,
      el: node,
      inViewport: userGenerated,
      fromY: playFromCursor,
    });

export const pushNode = (text: string, node: HTMLElement | Text): void => {
  const pos = getPosition(node, true);
  const outer = { text, ...pos, };
  appendWindowSentenceBuffer(outer);
};

export const processTextNode = (
  node: Text,
  buffer: SectionType[],
  lastKey: number
): {
  nextNode: HTMLElement | null;
  nextAfterIframe: HTMLElement | null;
} => {
  let nextNode;
  let parents;
  let nextAfterIframe;
  let firstParagraph: any;

  if (
    node.nodeValue &&
    isMaxText(removeHTMLSpaces(getInnerText(node.nodeValue)))
  ) {
    const sentences = getSentencesFromText(node.nodeValue) || [];
    firstParagraph = sentences[0] || {};
    parents = [];

    // Ensure nodeValue is defined and is a string
    const nodeValueLength = node.nodeValue.length;

    // Ensure firstParagraph.text is defined and is a string
    const firstParagraphLength = firstParagraph.text
      ? firstParagraph.text.length
      : 0;

    nextNode = node.splitText(
      firstParagraph && nodeValueLength >= firstParagraphLength
        ? firstParagraphLength
        : Math.floor(nodeValueLength / 2)
    );
  } else {
    ({
      next: nextNode,
      parents,
      nextAfterIframe,
    } = findNextSibling(node, true));
    console.log('processTextNode.nextNode', nextNode);
  }

  const nodeText = getInnerText(node.nodeValue || '');
  pushNode(nodeText, node);
  alterNode(node, lastKey + buffer.length);

  if (firstParagraph || (parents.length && parents[0].tagName !== 'A')) {
    pushAndClearBuffer(buffer, lastKey);
  }

  return { nextNode, nextAfterIframe, };
};

export const processElementNode = (
  node: HTMLElement,
  buffer: SectionType[],
  lastKey: number,
  playFromCursor: number,
  userGenerated: boolean
) => {
  let nextAfterIframe;
  let nextNode;
  const isVisibleNodeOrText = determineVisibility(
    node,
    playFromCursor,
    userGenerated
  );

  const isValidElement =
    isValidTag(node) &&
    isMinText(
      removeHTMLSpaces(getInnerText(node.innerText || node.textContent || ''))
    );

  const isTypePara =
    isVisibleNodeOrText &&
    (isParagraph(node) ||
      isHeading(node) ||
      (!hasChildNodes(node) &&
        isMinText(getInnerText(node.innerText || node.textContent || ''))));

  if (isValidElement && isTypePara) {
    pushAndClearBuffer(buffer, lastKey);
    alterDom(node, lastKey + buffer.length);
    pushSection(
      buffer,
      node,
      getInnerText(node.innerText || node.textContent || '')
    );
    ({ next: nextNode, nextAfterIframe, } = findNextSibling(node, true));
  } else {
    const nextSiblingResult = findNextSibling(node, true);

    const result =
      (isWikipedia() && isSkippableByDesign(node)) ||
      !isValidElement ||
      !isVisibleNodeOrText
        ? nextSiblingResult
        : node.childNodes[0]
          ? { next: node.childNodes[0], }
          : nextSiblingResult;

    ({ next: nextNode, nextAfterIframe, } = result);
  }

  return { nextNode, nextAfterIframe, };
};
