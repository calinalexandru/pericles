import { SectionType, } from '@pericles/constants';

import isMinText from '../predicates/isMinText';
import getInnerText from '../string-work/getInnerText';

import alterDom from './alterDom';
import removeHTMLSpaces from './removeHTMLSpaces';

export default function getGoogleFormsSections(): {
  out: SectionType[];
  maxPage: number;
  } {
  return {
    out: Array.from(
      document.querySelectorAll<HTMLElement>(
        'div[dir=auto], div[role=heading], label.docssharedWizToggleLabeledContainer'
      )
    ).reduce((acc, section) => {
      const text = removeHTMLSpaces(getInnerText(section.textContent || ''));
      if (isMinText(text)) {
        alterDom(section, acc.length);
        const {
          top = 0,
          width = 0,
          height = 0,
        } = section?.getBoundingClientRect?.() || {};
        acc.push({
          node: section,
          text,
          pos: { top, width, height, },
          encoded: encodeURIComponent(text),
        });
      }
      return acc;
    }, [] as SectionType[]),
    maxPage: 1,
  };
}
