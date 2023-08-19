/* eslint-disable no-bitwise */
import getGoogleDocsEditor from '../google-docs/getGoogleDocsEditor';
import isMinText from '../predicates/isMinText';

import alterRect from './alterRect';
import getGoogleDocsHeaderHeight from './getGoogleDocsHeaderHeight';
import getGoogleDocsPageHeight from './getGoogleDocsPageHeight';

export default function getGoogleDocsSectionsSvg(page) {
  console.log('getGoogleDocsSectionsSvg.page', page);
  const pageHeight = getGoogleDocsPageHeight();
  const headerHeight = getGoogleDocsHeaderHeight();
  const editor = getGoogleDocsEditor();
  const maxPage = ~~((editor.scrollHeight - headerHeight) / pageHeight);
  return {
    out: Array.from(
      Array.from(
        document.querySelectorAll(
          'div.kix-canvas-tile-content.kix-canvas-tile-selection'
        )
      )
        .find((el) => Number(el.style.zIndex) === page)
        ?.previousElementSibling?.querySelectorAll('svg g')
    ).reduce((acc, section) => {
      const rects = Array.from(section.querySelectorAll('rect'));
      const text = rects
        .map((rect) => rect.getAttribute('aria-label'))
        .join(' ');
      if (isMinText(text)) {
        rects.forEach((rect) => {
          alterRect(rect, acc.length);
        });
        const {
          top = 0,
          width = 0,
          height = 0,
        } = section?.getBoundingClientRect?.() || {};
        acc.push({
          node: section,
          text,
          pos: {
            top: ~~(top + editor.scrollTop),
            width: ~~width,
            height: ~~height,
          },
          encoded: encodeURIComponent(text),
        });
      }
      return acc;
    }, []),
    maxPage,
  };
}
