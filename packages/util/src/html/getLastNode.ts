import findNextSibling from './findNextSibling';
import getFirstNode from './getFirstNode';
import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';

export default function getLastNode(parserKey: number = 0): HTMLElement {
  const sections = Array.from(
    document.querySelectorAll(sectionQuerySelector(parserKey))
  );
  let lastSection = sections[sections.length - 1];

  if (!lastSection) {
    const iframeSections = getSelfIframes().reduce(
      (acc, iframe) =>
        acc.concat(
          Array.from(
            iframe.document.querySelectorAll<HTMLElement>(
              sectionQuerySelector(parserKey)
            )
          )
        ),
      [] as HTMLElement[]
    );

    lastSection = iframeSections[iframeSections.length - 1];
  }

  return lastSection ? findNextSibling(lastSection) : getFirstNode();
}
