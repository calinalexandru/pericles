import { SectionType, } from '@pericles/constants';

import isMinText from '../predicates/isMinText';
import getInnerText from '../string-work/getInnerText';

import alterDom from './alterDom';
import removeHTMLSpaces from './removeHTMLSpaces';

export default function getOpenBookSections(page: number): {
  out: SectionType[];
  maxPage: number;
} {
  console.log('getOpenBookSections.page', page);
  const pages = document.querySelectorAll('.page');
  const curPage = pages[page];
  if (!curPage) return { out: [], maxPage: pages.length, };
  console.log('getOpenBookSections.curPage', curPage);
  return {
    out: Array.from(curPage.querySelectorAll('.textLayer')).reduce(
      (acc: SectionType[], section) => {
        let text = '';
        if (
          isMinText(removeHTMLSpaces(getInnerText(section.textContent || '')))
        ) {
          const itemsSorted = Array.from(section.querySelectorAll('span'))
            .filter((item) =>
              isMinText(removeHTMLSpaces(getInnerText(item.textContent || '')))
            )
            .sort(
              (a, b) =>
                a?.getBoundingClientRect?.()?.top -
                b?.getBoundingClientRect?.()?.top
            );
          console.log('itemsSorted', itemsSorted);
          itemsSorted.forEach((paragraph) => {
            text += `${removeHTMLSpaces(
              getInnerText(paragraph.textContent || '')
            )} \n`;
            alterDom(paragraph, acc.length);
          });
          acc.push({
            node: section,
            text,
            encoded: encodeURIComponent(text),
          });
        }
        return acc;
      },
      []
    ),
    maxPage: pages.length,
  };
}
