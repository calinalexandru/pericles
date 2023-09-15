import { ATTRIBUTES, } from '@pericles/constants';

import getMarginsForScanBlock from '../math/getMarginsForScanBlock';

import getLastNode from './getLastNode';
// import getSelfIframes from './getSelfIframes';

const comparator = (expr1: boolean, expr2: boolean): number => {
  if (expr1 && !expr2) return -1;
  if (!expr1 && expr2) return 1;
  return 0;
};

function compareByHeading(a: HTMLElement, b: HTMLElement): number {
  return comparator(
    ATTRIBUTES.TAGS.H1.includes(a.tagName),
    ATTRIBUTES.TAGS.H1.includes(b.tagName)
  );
}

function compareByTag(a: HTMLElement, b: HTMLElement): number {
  return comparator(
    ATTRIBUTES.TAGS.VERBOSE.includes(a.tagName),
    ATTRIBUTES.TAGS.VERBOSE.includes(b.tagName)
  );
}

function compareByVerboseTagCount(a: HTMLElement, b: HTMLElement): number {
  const countA = a.querySelectorAll(ATTRIBUTES.TAGS.VERBOSE.join(',')).length;
  const countB = b.querySelectorAll(ATTRIBUTES.TAGS.VERBOSE.join(',')).length;
  return countB - countA;
}

function compareByPosition(a: HTMLElement, b: HTMLElement): number {
  return (
    Math.floor(a.getBoundingClientRect().top) -
    Math.floor(b.getBoundingClientRect().top)
  );
}

function compareByTextLength(a: HTMLElement, b: HTMLElement): number {
  return (b.innerText?.length ?? 0) - (a.innerText?.length ?? 0);
}

function compareByChildNodeCount(a: HTMLElement, b: HTMLElement): number {
  return (b.childNodes?.length ?? 0) - (a.childNodes?.length ?? 0);
}

function getUniqueFiltered(
  margins: { x: number; y: number }[],
  doc: Document
): HTMLElement[] {
  const elements = margins
    .map(({ x, y, }) => doc.elementFromPoint(x, y) as HTMLElement)
    .filter(Boolean);
  return [ ...new Set(elements), ];
}

export default function getElementFromPoint(offset: number): HTMLElement {
  console.log('getElementFromPOint.offset', offset);
  const margins = getMarginsForScanBlock({
    size: window.innerWidth,
    offset,
  });
  console.log('margins', margins);
  const elems = getUniqueFiltered(margins, document);

  console.log('margins.elems', elems);

  // TODO: this method makes ChatGPT website (and others to crash)
  // const elemsInIframes = getSelfIframes().reduce((acc, iframe) => {
  //   const { innerHeight, innerWidth, scrollY, } = iframe.window;
  //   if (innerHeight * innerWidth === 0) return [];
  //   const marginsIframe = getMarginsForScanBlock({
  //     size: innerWidth,
  //     start: scrollY,
  //   });
  //   return [ ...acc, ...getUniqueFiltered(marginsIframe, iframe.document), ];
  // }, [] as HTMLElement[]);

  const elemsInIframes: HTMLElement[] = [];
  const sortedElems1 = [ ...elems, ...elemsInIframes, ].sort(
    (a, b) =>
      compareByHeading(a, b) ||
      compareByTag(a, b) ||
      compareByPosition(a, b) ||
      compareByTextLength(a, b) ||
      compareByVerboseTagCount(a, b) ||
      compareByChildNodeCount(a, b)
  );

  return sortedElems1[0] || getLastNode();
}
