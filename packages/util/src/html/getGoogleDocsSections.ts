/* eslint-disable no-bitwise */
import { SectionType, } from '@pericles/constants';

import isMinText from '../predicates/isMinText';
import getInnerText from '../string-work/getInnerText';

import alterDom from './alterDom';
import removeHTMLSpaces from './removeHTMLSpaces';

export default function getGoogleDocsSections(page: number): {
  out: SectionType[];
  maxPage: number;
} {
  const pages = document.querySelectorAll('.kix-page');
  const curPage = pages[page];
  if (!curPage) return { out: [], maxPage: pages.length, };
  return {
    out: Array.from(curPage.querySelectorAll('.kix-paragraphrenderer')).reduce(
      (acc: SectionType[], section) => {
        const text = removeHTMLSpaces(getInnerText(section.textContent || ''));
        if (isMinText(text)) {
          Array.from(
            section.querySelectorAll('.kix-wordhtmlgenerator-word-node')
          )
            .filter((item) =>
              isMinText(removeHTMLSpaces(getInnerText(item.textContent || '')))
            )
            .forEach((paragraph) => {
              alterDom(paragraph, acc.length);
            });
          const {
            top = 0,
            width = 0,
            height = 0,
          } = section?.getBoundingClientRect?.() || {};
          acc.push({
            node: section,
            text,
            pos: { top: ~~top, width: ~~width, height: ~~height, },
            encoded: encodeURIComponent(text),
          });
        }
        return acc;
      },
      [] as SectionType[]
    ),
    maxPage: pages.length,
  };
}
