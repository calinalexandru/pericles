/* eslint-disable no-bitwise */
import isMinText from '../predicates/isMinText';
import getInnerText from '../string-work/getInnerText';

import alterDom from './alterDom';
import removeHTMLSpaces from './removeHTMLSpaces';

type AccType = {
  node: Element;
  text: string;
  pos: any;
  encoded: string;
};

export default function getGoogleBookSections(): {
  out: AccType[];
  maxPage: number;
  } {
  const maxPage: number = Number(
    document
      .querySelector('.page-nums')
      ?.lastChild?.textContent?.replace('/', '')
      ?.trim() || 0
  );
  const allPages = Array.from(document.querySelectorAll('.-gb-loaded'));
  return {
    out: allPages.reduce((acc: AccType[], section: HTMLElement) => {
      if (section?.getBoundingClientRect?.()?.width <= 0) return acc;
      let paragraphs = Array.from(
        section.querySelectorAll(
          `p.gtxt_body, .text-layer > div[data-cfi-index] > p[data-cfi-index], .text-layer > div[data-cfi-index] > div[data-cfi-index], section > div > * `
        )
      );
      if (!paragraphs.length)
        paragraphs = Array.from(
          section.querySelectorAll('reader-rendered-page > div > *')
        );
      const text = paragraphs.map((para) => para.textContent).join(' ');
      if (isMinText(text)) {
        paragraphs.forEach((para) => {
          const paraText = removeHTMLSpaces(getInnerText(para.textContent));
          if (paraText.length) {
            alterDom(para, acc.length);
            const {
              top = 0,
              width = 0,
              height = 0,
            } = para?.getBoundingClientRect?.() || {};
            acc.push({
              node: para,
              text: paraText,
              pos: { top: ~~top, width: ~~width, height: ~~height, },
              encoded: encodeURIComponent(text),
            });
          }
        });
      }
      return acc;
    }, []),
    maxPage,
  };
}
