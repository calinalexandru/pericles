import { ATTRIBUTES, PARSER_TYPES, ParserTypes, } from '@pericles/constants';
import {
  compareValuesWithMargin,
  getViewportByDocType,
  isHtmlElement,
  isWindow,
} from '@pericles/util';

export default class Autoscroll {

  static lastY: number = 0;

  static to(y: number, parserType: ParserTypes = PARSER_TYPES.DEFAULT) {
    const viewport = getViewportByDocType(window, parserType);
    console.log('Autoscroll.to.viewport', viewport);
    if (!y || !viewport) {
      console.log('Autoscroll is 0 or viewport null', { y, viewport, });
      return;
    }

    const scrollY = 0;
    const isWindowViewport = viewport === window;
    try {
      const { lastY, } = Autoscroll;
      if (isHtmlElement(viewport)) {
        viewport.style.scrollBehavior = 'smooth';
        console.log('setting scroll behaviour, smoother');
      }

      console.log('Autoscroll.lastY, scrollY, y', lastY, scrollY, y);
      if (
        lastY === 0 ||
        compareValuesWithMargin(
          y,
          lastY,
          isWindowViewport
            ? ATTRIBUTES.AUTOSCROLL.THRESHOLD
            : ATTRIBUTES.AUTOSCROLL.BOOK_THRESHOLD
        )
      ) {
        const top = y - 200;
        console.log('Autoscroll with section - top, viewport', top, viewport);
        if (isHtmlElement(viewport)) {
          viewport.scrollTop = top;
        }
        if (isWindow(viewport)) {
          window.scrollTo({ top, behavior: 'smooth', });
        }
        Autoscroll.lastY = y;
      }
    } catch (e) {
      console.error('Autoscroll failed', e);
    }
  }

  static clear() {
    Autoscroll.lastY = 0;
    // TODO: stop animations
    // window.stop();
  }

}
