import { ATTRIBUTES, } from '@pericles/constants';

import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';
import wrapWordTag from './wrapWordTag';

export default function splitSentencesIntoWords(sectionsIds, jp = false) {
  if (!sectionsIds?.length) return;
  const query = sectionsIds.map((id) => sectionQuerySelector(id)).join(',');
  const sectionsInFrames = getSelfIframes().reduce(
    (acc, iframe) => [
      ...acc,
      ...Array.from(iframe.document.querySelectorAll(query)),
    ],
    []
  );
  const sections = document.querySelectorAll(query);
  let oldKey;
  let wordIndex;
  let newKey;
  [ ...sections, ...sectionsInFrames, ].forEach((section) => {
    newKey = section.getAttribute(ATTRIBUTES.ATTRS.SECTION);
    if (oldKey !== newKey) {
      wordIndex = 0;
    }
    wordIndex = wrapWordTag(section.childNodes[0], wordIndex, jp);
    oldKey = newKey;
  });
}
