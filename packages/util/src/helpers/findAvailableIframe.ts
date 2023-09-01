import { ParserIframesType, } from '@pericles/constants';

import isIframeParsing from '../predicates/isIframeParsing';

export default function findAvailableIframe(
  iframes: ParserIframesType
): string | boolean {
  if (!iframes) return false;
  let out: any = false;
  Object.keys(iframes).forEach((key) => {
    if (out === false && !isIframeParsing(key, iframes)) out = key;
  });
  return out;
}
