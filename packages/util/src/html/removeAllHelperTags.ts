import { ATTRIBUTES, } from '@pericles/constants';

import getSelfIframes from './getSelfIframes';

export default function removeAllHelperTags(): void {
  const safeIframes = getSelfIframes();
  const allWordsInIframes = safeIframes.reduce(
    (acc, iframe) => [
      ...acc,
      ...Array.from(
        iframe.document.querySelectorAll<HTMLElement>(`${ATTRIBUTES.TAGS.WORD}`)
      ),
    ],
    [] as HTMLElement[]
  );
  const allWords = Array.from(
    document.querySelectorAll(`${ATTRIBUTES.TAGS.WORD}`)
  );
  [ ...allWords, ...allWordsInIframes, ].forEach((word) => {
    word.replaceWith(document.createTextNode(word.textContent || ''));
  });

  const allSections = Array.from(
    document.querySelectorAll(`${ATTRIBUTES.TAGS.SECTION}`)
  );
  allSections.forEach((section) => {
    section?.parentNode?.insertBefore?.(
      document.createTextNode(section.textContent || ''),
      section
    );
    section.remove();
  });

  const allRectSections = Array.from(
    document.querySelectorAll(
      `${ATTRIBUTES.TAGS.RECT}[${ATTRIBUTES.ATTRS.SECTION}]`
    )
  );

  allRectSections.forEach((rect) => {
    rect.removeAttribute(ATTRIBUTES.ATTRS.SECTION);
  });
}
