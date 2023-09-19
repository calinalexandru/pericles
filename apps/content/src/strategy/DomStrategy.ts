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
  isIframeParsing,
} from '@pericles/util';

import DOMWalker from './DomWalker';
import { GetSectionsResult, IDOMWalker, IDomStrategy, } from './IDom';

export default class DomStrategy implements IDomStrategy {

  type: ParserTypes = PARSER_TYPES.DEFAULT;

  isUserTriggered: boolean = false;

  verticalStartOffset: number = 0;

  parserKey: number = 0;

  parserIframes: ParserIframesType = {};

  domWalker: IDOMWalker = new DOMWalker();

  setup(
    type: ParserTypes = PARSER_TYPES.DEFAULT,
    parserKey: number = 0,
    isUserTriggered: boolean = false,
    verticalStartOffset: number = 0,
    parserIframes: ParserIframesType = {}
  ): void {
    Object.assign(this, {
      type,
      parserKey,
      isUserTriggered,
      verticalStartOffset,
      parserIframes,
    });
  }

  getSections(): GetSectionsResult {
    const { hostname, } = window.location;
    let pageIndex = 0;
    let maxPage = 0;
    let out = [];
    let end = false;
    let iframeBlocked = false;

    switch (this.type) {
    case PARSER_TYPES.GOOGLE_BOOK:
      pageIndex = getGoogleBookPage(window);
      ({ maxPage, out, } = getGoogleBookSections());
      break;

    case PARSER_TYPES.GOOGLE_DOC_SVG:
      pageIndex = getGoogleDocsPageByQuery();
      ({ maxPage, out, } = getGoogleDocsSectionsSvg(pageIndex));
      break;

    case PARSER_TYPES.GOOGLE_DOC:
      pageIndex = getGoogleDocsPageByQuery();
      ({ maxPage, out, } = getGoogleDocsSections(pageIndex));
      break;

    case PARSER_TYPES.GOOGLE_FORM:
      ({ maxPage, out, } = getGoogleFormsSections());
      break;

    case PARSER_TYPES.OPEN_BOOK:
      // TODO: implement this
      ({ maxPage, out, } = getOpenBookSections(1));
      console.log('open-book.sections', out);
      break;

    default: {
      const startingNode = this.isUserTriggered
        ? getElementFromPoint(
          (isIframeParsing(hostname, this.parserIframes) &&
                this.parserIframes[hostname]?.top) ||
                0
        )
        : getLastNode(this.parserKey ? this.parserKey - 1 : 0);

      this.domWalker.setup(
        startingNode,
        this.parserKey,
        this.isUserTriggered,
        this.verticalStartOffset
      );
      ({ out, end, iframeBlocked, } = this.domWalker.walk());
    }
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
