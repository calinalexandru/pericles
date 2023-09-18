import { ParserIframesType, } from '@pericles/constants';

export default function isIframeParsing(
  name: string,
  iframes: ParserIframesType
): boolean {
  const ilie = iframes?.[name]?.parsing === true;
  console.log('isIframeParsing', ilie);
  return ilie;
}
