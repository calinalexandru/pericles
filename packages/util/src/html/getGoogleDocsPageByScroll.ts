/* eslint-disable no-bitwise */
import getGoogleDocsHeaderHeight from './getGoogleDocsHeaderHeight';
import getGoogleDocsPageHeight from './getGoogleDocsPageHeight';

export default function getGoogleDocsPageByScroll(): number {
  const pageHeight = getGoogleDocsPageHeight();
  const headerHeight = getGoogleDocsHeaderHeight();
  const scrollTop = document?.querySelector('.kix-appview-editor')?.scrollTop;
  return scrollTop > pageHeight
    ? ~~((scrollTop - headerHeight) / pageHeight) + 1
    : 1;
}
