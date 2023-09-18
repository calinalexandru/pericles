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

export const getPosition = (
  node: Node | Element | HTMLElement | Text,
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
