import { findNextSibling, } from './findNextSibling';
import getFirstNode from './getFirstNode';
import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';

export default function getLastNode(parserKey: number = 0): Node | null {
  console.log(
    'getLastNode.parserKey',
    parserKey,
    sectionQuerySelector(parserKey)
  );
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>(sectionQuerySelector(parserKey))
  );
  console.log('getLastNode.sections', sections);
  let lastSection = sections[sections.length - 1];
  console.log('getLastNode.lastSection', lastSection);

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

  if (lastSection) {
    const out = findNextSibling(lastSection).node;
    console.log('getLastNode.out', out);
    return out;
  }

  return getFirstNode();
}
