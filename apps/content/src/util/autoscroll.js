import { ATTRIBUTES, PARSER_TYPES, } from '@pericles/constants';
import { compareValuesWithMargin, getViewportByDocType, } from '@pericles/util';

export default class Autoscroll {

  static to(y, parserType = PARSER_TYPES.DEFAULT) {
    const viewport = getViewportByDocType(window, parserType);
    if (!y || !viewport) {
      console.log('Autoscroll is 0 or viewport null', { y, viewport, });
      return;
    }

    const scrollY = 0;
    const isWindowViewport = viewport === window;
    try {
      const { lastY, } = Autoscroll;
      if (!isWindowViewport) {
        /* eslint-disable-next-line */
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
        if (!isWindowViewport) {
          /* eslint-disable-next-line */
          viewport.scrollTop = top;
        } else window.scrollTo({ top, behavior: 'smooth', });
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

Autoscroll.lastY = 0;
