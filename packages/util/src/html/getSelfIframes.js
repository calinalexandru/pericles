import { ATTRIBUTES, } from '@pericles/constants';

import canAccessIframe from '../helpers/canAccessIframe';
import getIframeDocument from '../helpers/getIframeDocument';

export default function getSelfIframes() {
  let localWindow;
  let localDocument;
  return Array.from(document.querySelectorAll('iframe')).reduce(
    (acc, iframe) => {
      if (
        iframe &&
        iframe.getAttribute('id') !== ATTRIBUTES.ATTRS.CONTENT_IFRAME &&
        canAccessIframe(iframe)
      ) {
        localWindow = iframe.contentDocument;
        localDocument = getIframeDocument(iframe);
        if (localWindow && localDocument)
          acc.push({ iframe, window: localWindow, document: localDocument, });
        localWindow = null;
        localDocument = null;
      }
      return acc;
    },
    []
  );
}
