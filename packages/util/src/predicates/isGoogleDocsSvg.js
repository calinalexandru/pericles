import { PARSER_TYPES, } from '@pericles/constants';

export default function isGoogleDocsSvg(parserType) {
  return parserType === PARSER_TYPES.GOOGLE_DOC_SVG;
}
