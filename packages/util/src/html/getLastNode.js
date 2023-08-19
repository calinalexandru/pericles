import { last, } from 'ramda';

import findNextSibling from './findNextSibling';
import getFirstNode from './getFirstNode';
import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';

export default function getLastNode(parserKey = 0) {
  let lastSection = last(
    Array.from(document.querySelectorAll(sectionQuerySelector(parserKey)))
  );
  if (!lastSection) {
    lastSection = last(
      getSelfIframes().reduce(
        (acc, iframe) => [
          ...acc,
          ...Array.from(
            iframe.document.querySelectorAll(sectionQuerySelector(parserKey))
          ),
        ],
        []
      )
    );
  }
  return lastSection ? findNextSibling(lastSection) : getFirstNode();
}
