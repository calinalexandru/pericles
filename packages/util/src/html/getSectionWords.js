import { ATTRIBUTES, } from '@pericles/constants';

import getSelfIframes from './getSelfIframes';

export default function getSectionWords(id) {
  const findWords = Array.from(
    document.querySelectorAll(
      `${ATTRIBUTES.TAGS.SECTION}[${ATTRIBUTES.ATTRS.SECTION}="${id}"] ${ATTRIBUTES.TAGS.WORD}`
    )
  );
  if (findWords.length) return findWords;
  return getSelfIframes().reduce(
    (acc, iframe) => [
      ...acc,
      ...Array.from(
        iframe.document.querySelectorAll(
          `${ATTRIBUTES.TAGS.SECTION}[${ATTRIBUTES.ATTRS.SECTION}="${id}"] ${ATTRIBUTES.TAGS.WORD}`
        )
      ),
    ],
    []
  );
}
