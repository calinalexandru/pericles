import { PARSER_TYPES, } from '@pericles/constants';
import {
  getElementFromPoint,
  getGoogleBookPage,
  getGoogleBookSections,
  getGoogleDocsPageByQuery,
  getGoogleDocsSections,
  getGoogleDocsSectionsSvg,
  getGoogleFormsSections,
  getLastNode,
  getOpenBookSections,
  getStoredNode,
  isGoogleBook,
  isGoogleDocs,
  isGoogleDocsSvg,
  isIframeParsing,
  setWindowSentenceBuffer,
  walkTheDOM,
} from '@pericles/util';

export default class DomStrategy {

  type = PARSER_TYPES.DEFAULT;

  iframes = {};

  userGenerated = false;

  working = false;

  fromCursor = false;

  skipUntilY = 0;

  parserKey = 0;

  constructor({
    parserType = PARSER_TYPES.DEFAULT,
    working,
    userGenerated,
    iframes,
    parserKey,
    skipUntilY,
    fromCursor,
  }) {
    this.type = parserType;
    this.working = working;
    this.iframes = iframes;
    this.userGenerated = userGenerated;
    this.parserKey = parserKey;
    this.skipUntilY = skipUntilY;
    this.fromCursor = fromCursor;
  }

  getSections() {
    const { hostname, } = window.location;
    let pageIndex = 0;
    let maxPage = 0;
    let out = [];
    let blocked = false;
    const nextNode = this.working
      ? getStoredNode()
      : getLastNode(this.parserKey ? this.parserKey - 1 : 0);
    if (isGoogleBook(this.type)) {
      pageIndex = getGoogleBookPage(window);
      ({ maxPage, out, } = getGoogleBookSections(pageIndex));
    } else if (isGoogleDocsSvg(this.type)) {
      pageIndex = getGoogleDocsPageByQuery();
      ({ maxPage, out, } = getGoogleDocsSectionsSvg(pageIndex));
    } else if (isGoogleDocs(this.type)) {
      pageIndex = getGoogleDocsPageByQuery();
      ({ maxPage, out, } = getGoogleDocsSections(pageIndex));
    } else if (this.type === PARSER_TYPES.GOOGLE_FORM) {
      ({ maxPage, out, } = getGoogleFormsSections());
    } else if (this.type === PARSER_TYPES.OPEN_BOOK) {
      // TODO: implement this
      ({ maxPage, out, } = getOpenBookSections(1));
      console.log('open-book.sections', out);
    } else {
      setWindowSentenceBuffer('');
      ({ out, blocked, } = walkTheDOM({
        node:
          !this.working && this.userGenerated
            ? getElementFromPoint(
              (isIframeParsing(hostname, this.parserIframes) &&
                  this.parserIframes?.[hostname]?.top) ||
                  0
            )
            : nextNode,
        buffer: [],
        lastKey: this.parserKey,
        userGenerated: this.userGenerated,
        playFromCursor: this.fromCursor ? this.skipUntilY : 0,
      }));
    }

    return {
      out,
      maxPage,
      blocked,
      pageIndex,
    };
  }

}
