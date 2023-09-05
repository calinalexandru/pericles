import {
  PARSER_TYPES,
  ParserIframesType,
  ParserTypes,
} from '@pericles/constants';
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

  type: ParserTypes = PARSER_TYPES.DEFAULT;

  userGenerated: boolean = false;

  working: boolean = false;

  fromCursor: boolean = false;

  skipUntilY: number = 0;

  parserKey: number = 0;

  parserIframes: ParserIframesType;

  constructor({
    parserType = PARSER_TYPES.DEFAULT,
    working,
    userGenerated,
    parserIframes,
    parserKey,
    skipUntilY,
    fromCursor,
  }: {
    parserType?: ParserTypes;
    working?: boolean;
    userGenerated?: boolean;
    parserIframes?: ParserIframesType;
    parserKey?: number;
    skipUntilY?: number;
    fromCursor?: boolean;
  }) {
    this.type = parserType;
    this.working = working || false;
    this.userGenerated = userGenerated || false;
    this.parserKey = parserKey || 0;
    this.skipUntilY = skipUntilY || 0;
    this.fromCursor = fromCursor || false;
    this.parserIframes = parserIframes || {};
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
      ({ maxPage, out, } = getGoogleBookSections());
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
