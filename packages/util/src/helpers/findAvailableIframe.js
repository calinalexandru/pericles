import isIframeParsing from '../predicates/isIframeParsing';

export default function findAvailableIframe(iframes) {
  if (!iframes) return false;
  let out = false;
  Object.keys(iframes).forEach((key) => {
    if (out === false && !isIframeParsing(iframes[key])) out = key;
  });
  return out;
}
