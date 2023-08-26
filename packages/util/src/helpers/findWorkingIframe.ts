import isIframeParsing from '../predicates/isIframeParsing';

export default function findWorkingIframe(iframes: any): any {
  if (!iframes) return false;
  let out: any = false;
  Object.keys(iframes).forEach((key) => {
    if (out === false && isIframeParsing(iframes[key])) out = key;
  });
  return out;
}
