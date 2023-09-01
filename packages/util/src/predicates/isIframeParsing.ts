import { ParserIframesType, } from '@pericles/constants';

export default function isIframeParsing(
  name: string,
  iframes: ParserIframesType
): boolean {
  return iframes?.[name]?.parsing === true;
}
