/* eslint-disable no-bitwise */
import { ATTRIBUTES, } from '@pericles/constants';

import getHostnameFromUrl from '../location/getHostnameFromUrl';

type GetIframesForStoreOut = {
  [key: string]: {
    parsing: boolean;
    top: number;
  };
};

export default function getIframesForStore(
  window: Window
): GetIframesForStoreOut {
  if (!window) return {};
  let name: string;
  return Array.from(window.document.querySelectorAll('iframe')).reduce(
    (acc, frame) => {
      if (
        frame.getAttribute('id') === ATTRIBUTES.ATTRS.CONTENT_IFRAME ||
        !frame.getAttribute('src')
      ) {
        return acc;
      }
      name = getHostnameFromUrl(frame.getAttribute('src') || '');
      if (!name || name === window.location.hostname) return acc;
      acc[name] = {
        parsing: false,
        top: ~~frame?.getBoundingClientRect?.()?.top,
      };
      name = '';
      return acc;
    },
    {} as any
  );
}
