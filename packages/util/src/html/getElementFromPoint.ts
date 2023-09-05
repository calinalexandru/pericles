/* eslint-disable no-bitwise */
import { ATTRIBUTES, } from '@pericles/constants';

import getMarginsForScanBlock from '../math/getMarginsForScanBlock';

import getLastNode from './getLastNode';
import getSelfIframes from './getSelfIframes';

const comparator = (expr1: boolean, expr2: boolean) => {
  if (expr1 && !expr2) return -1;
  if (!expr1 && expr2) return 1;
  return 0;
};

const getUniqueFiltered = (
  margins: { x: number; y: number }[],
  document: Document
): HTMLElement[] => [
  ...new Set(
    margins.reduce((acc, { x, y, }) => {
      const find = document.elementFromPoint(x, y);
      if (find) acc.push(find as HTMLElement);

      return acc;
    }, [] as HTMLElement[])
  ),
];

export default function getElementFromPoint(offset: number): HTMLElement {
  const margins = getMarginsForScanBlock({
    size: window.innerWidth,
    offset,
  });
  console.log('margins', margins);
  const elems = getUniqueFiltered(margins, document);

  console.log('margins.elems', elems);

  const elemsInIframes = getSelfIframes().reduce((acc, iframe) => {
    const { innerHeight, innerWidth, scrollY, } = iframe.window;
    if (innerHeight * innerWidth === 0) return [];
    const marginsIframe = getMarginsForScanBlock({
      size: innerWidth,
      start: scrollY,
    });
    return [ ...acc, ...getUniqueFiltered(marginsIframe, iframe.document), ];
  }, [] as HTMLElement[]);
  const sortedElems1 = [ ...elems, ...elemsInIframes, ].sort(
    (a, b) =>
      comparator(
        ATTRIBUTES.TAGS.H1.includes(a.tagName),
        ATTRIBUTES.TAGS.H1.includes(b.tagName)
      ) ||
      comparator(
        ATTRIBUTES.TAGS.VERBOSE.includes(a.tagName),
        ATTRIBUTES.TAGS.VERBOSE.includes(b.tagName)
      ) ||
      ~~a.getBoundingClientRect().top - ~~b.getBoundingClientRect().top ||
      b.innerText?.length - a.innerText?.length ||
      b.querySelectorAll(ATTRIBUTES.TAGS.VERBOSE.join(','))?.length -
        a.querySelectorAll(ATTRIBUTES.TAGS.VERBOSE.join(','))?.length ||
      b.childNodes?.length - a.childNodes?.length
  );
  return sortedElems1[0] || getLastNode();
}
