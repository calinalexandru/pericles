import { SectionType, } from '@pericles/constants';

import isHeading from '../../predicates/isHeading';
import isHTMLElement from '../../predicates/isHtmlElement';
import isMinText from '../../predicates/isMinText';
import isParagraph from '../../predicates/isParagraph';
import isValidTag from '../../predicates/isValidTag';
import getInnerText from '../../string-work/getInnerText';
import hasChildNodes from '../hasChildNodes';
import isVisible from '../isVisible';
import isVisibleNode from '../isVisibleNode';
import removeHTMLSpaces from '../removeHTMLSpaces';

export type Position = {
  top: number;
  width: number;
  height: number;
};

export const getPosition = (node: HTMLElement | Text): Position => {
  let rect: DOMRect;

  if (node instanceof Text) {
    const range = document.createRange();
    range.selectNode(node);
    rect = range.getBoundingClientRect();
  } else {
    rect = node.getBoundingClientRect();
  }

  const { top = 0, width = 0, height = 0, } = rect;

  // If the node is part of an iframe, adjust its position
  // based on the iframe's position
  const { y: adjustY = 0, } =
    node.ownerDocument?.defaultView?.frameElement?.getBoundingClientRect() ||
    {};

  return {
    top: Math.floor(top + window.scrollY + adjustY),
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

export const determineVisibility = (
  node: Node,
  playFromCursor: number,
  userGenerated: boolean
): boolean => {
  console.log('determineVisibility', node, playFromCursor, userGenerated);
  if (isHTMLElement(node)) {
    return isVisible({
      window,
      el: node,
      inViewport: userGenerated,
      fromY: playFromCursor,
    });
  }

  return isVisibleNode({ window, node, fromCursorY: playFromCursor, });
};

export const validateElementNode = (node: HTMLElement) => {
  const isValidElement =
    isValidTag(node) &&
    isMinText(
      removeHTMLSpaces(getInnerText(node.innerText || node.textContent || ''))
    );

  const isReadbleType =
    isParagraph(node) ||
    isHeading(node) ||
    (!hasChildNodes(node) &&
      isMinText(getInnerText(node.innerText || node.textContent || '')));

  console.log('validateElementNode', { isValidElement, isReadbleType, });

  return isValidElement && isReadbleType;
};
