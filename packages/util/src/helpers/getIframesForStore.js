/* eslint-disable no-bitwise */
import { ATTRIBUTES, } from '@pericles/constants';

import getHostnameFromUrl from '../location/getHostnameFromUrl';

export default function getIframesForStore(window) {
  if (!window) return {};
  let name;
  return Array.from(window.document.querySelectorAll('iframe')).reduce(
    (acc, frame) => {
      if (
        frame.getAttribute('id') === ATTRIBUTES.ATTRS.CONTENT_IFRAME ||
        !frame.getAttribute('src')
      ) {
        return acc;
      }
      name = getHostnameFromUrl(frame.getAttribute('src'));
      if (!name || name === window.location.hostname) return acc;
      acc[name] = {
        parsing: false,
        top: ~~frame?.getBoundingClientRect?.()?.top,
      };
      name = null;
      return acc;
    },
    {}
  );
}
