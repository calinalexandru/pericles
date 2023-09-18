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
import { GetSectionsResult, IDOMWalker, IDomStrategy, } from './IDom';

export default class DomStrategy implements IDomStrategy {

  type: ParserTypes = PARSER_TYPES.DEFAULT;

  isUserTriggered: boolean = false;

  verticalStartOffset: number = 0;

  parserKey: number = 0;

  parserIframes: ParserIframesType;

  domWalker: IDOMWalker;

  constructor() {
    this.domWalker = new DOMWalker();
  }

  setup(
    type?: ParserTypes,
    parserKey?: number,
    isUserTriggered?: boolean,
    verticalStartOffset?: number,
    parserIframes?: ParserIframesType
  ): void {
    this.type = type || PARSER_TYPES.DEFAULT;
    this.parserKey = parserKey || 0;
    this.isUserTriggered = isUserTriggered || false;
    this.verticalStartOffset = verticalStartOffset || 0;
    this.parserIframes = parserIframes || {};
  }

  getSections(): GetSectionsResult {
    const { hostname, } = window.location;
    let pageIndex = 0;
    let maxPage = 0;
    let out = [];
    let end = false;
    let iframeBlocked = false;
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
      this.domWalker.setup(
        this.isUserTriggered
          ? getElementFromPoint(
            (isIframeParsing(hostname, this.parserIframes) &&
                this.parserIframes?.[hostname]?.top) ||
                0
          )
          : getLastNode(this.parserKey ? this.parserKey - 1 : 0),
        this.parserKey,
        this.isUserTriggered,
        this.verticalStartOffset
      );

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
