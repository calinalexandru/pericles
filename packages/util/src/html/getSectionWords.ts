import { ATTRIBUTES, } from '@pericles/constants';

import getSelfIframes from './getSelfIframes';

export default function getSectionWords(id: string): HTMLElement[] {
  const findWords = Array.from(
    document.querySelectorAll<Element>(
      `${ATTRIBUTES.TAGS.SECTION}[${ATTRIBUTES.ATTRS.SECTION}="${id}"] ${ATTRIBUTES.TAGS.WORD}`
    )
  ) as HTMLElement[];
  if (findWords.length) return findWords;
  return getSelfIframes().reduce<HTMLElement[]>(
    (acc, iframe) => [
      ...acc,
      ...(Array.from(
        iframe.document.querySelectorAll(
          `${ATTRIBUTES.TAGS.SECTION}[${ATTRIBUTES.ATTRS.SECTION}="${id}"] ${ATTRIBUTES.TAGS.WORD}`
        )
      ) as HTMLElement[]),
    ],
    [] as HTMLElement[]
  );
}
