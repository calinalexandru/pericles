import { ATTRIBUTES, } from '@pericles/constants';

import isTextNode from '../predicates/isTextNode';

import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';
import wrapWordTag from './wrapWordTag';

export default function splitSentencesIntoWords(
  sectionsIds: number[],
  jp: boolean = false
): void {
  if (!sectionsIds?.length) return;
  const query = sectionsIds.map((id) => sectionQuerySelector(id)).join(',');
  const sectionsInFrames: HTMLElement[] = getSelfIframes().reduce(
    (acc, iframe) => [
      ...acc,
      ...Array.from(iframe.document.querySelectorAll<HTMLElement>(query)),
    ],
    [] as HTMLElement[]
  );
  const sections = document.querySelectorAll<HTMLElement>(query);
  let oldKey: number;
  let wordIndex: number;
  let newKey: number;
  [ ...sections, ...sectionsInFrames, ].forEach((section: HTMLElement) => {
    newKey = Number(section.getAttribute(ATTRIBUTES.ATTRS.SECTION)) || 0;
    if (oldKey !== newKey) {
      wordIndex = 0;
    }
    if (isTextNode(section.childNodes[0])) {
      wordIndex = wrapWordTag(section.childNodes[0], wordIndex, jp);
    }
    oldKey = newKey;
  });
}
