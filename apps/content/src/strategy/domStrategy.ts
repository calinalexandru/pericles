import { IDOMWalker, } from '@/interfaces/api';
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
  isGoogleBook,
  isGoogleDocs,
  isGoogleDocsSvg,
  isIframeParsing,
} from '@pericles/util';

import DOMWalker from './DomWalker';

export default class DomStrategy {

  type: ParserTypes = PARSER_TYPES.DEFAULT;

  userGenerated: boolean = false;

  fromCursor: boolean = false;

  skipUntilY: number = 0;

  parserKey: number = 0;

  parserIframes: ParserIframesType;

  domWalker: IDOMWalker;

  constructor() {
    this.domWalker = new DOMWalker();
    this.reset();
  }

  reset(): void {
    this.type = PARSER_TYPES.DEFAULT;
    this.userGenerated = false;
    this.parserKey = 0;
    this.skipUntilY = 0;
    this.fromCursor = false;
    this.parserIframes = {};
  }

  getSections() {
    console.log('DomStrategy.getSections', {
      parserKey: this.parserKey,
      skipUntilY: this.skipUntilY,
      fromCursor: this.fromCursor,
      userGenerated: this.userGenerated,
    });
    const { hostname, } = window.location;
    let pageIndex = 0;
    let maxPage = 0;
    let out = [];
    let end = false;
    let iframeBlocked = false;
    // const nextNode = this.working
    //   ? getStoredNode()
    //   : getLastNode(this.parserKey ? this.parserKey - 1 : 0);
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
      // setWindowSentenceBuffer('');
      // ({ out, blocked, } = walkTheDOM({
      //   node:
      //     !this.working && this.userGenerated
      //       ? getElementFromPoint(
      //         (isIframeParsing(hostname, this.parserIframes) &&
      //             this.parserIframes?.[hostname]?.top) ||
      //             0
      //       )
      //       : nextNode,
      //   buffer: [],
      //   lastKey: this.parserKey,
      //   userGenerated: this.userGenerated,
      //   playFromCursor: this.fromCursor ? this.skipUntilY : 0,
      // }));
      this.domWalker.reset();

      this.domWalker.playFromCursor = this.fromCursor ? this.skipUntilY : 0;
      this.domWalker.userGenerated = this.userGenerated;
      this.domWalker.lastKey = this.parserKey;
      this.domWalker.node = this.userGenerated
        ? getElementFromPoint(
          (isIframeParsing(hostname, this.parserIframes) &&
              this.parserIframes?.[hostname]?.top) ||
              0
        )
        : getLastNode(this.parserKey ? this.parserKey - 1 : 0);
      ({ out, end, iframeBlocked, } = this.domWalker.walk());
    }

    return {
      out,
      maxPage,
      end,
      iframeBlocked,
      pageIndex,
    };
  }

}
