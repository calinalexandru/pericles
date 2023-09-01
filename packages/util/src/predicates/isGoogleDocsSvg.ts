import { PARSER_TYPES, ParserTypes, } from '@pericles/constants';

export default function isGoogleDocsSvg(parserType: ParserTypes) {
  return parserType === PARSER_TYPES.GOOGLE_DOC_SVG;
}
