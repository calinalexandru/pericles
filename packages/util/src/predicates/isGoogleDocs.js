import { PARSER_TYPES, } from '@pericles/constants';

export default function isGoogleDocs(parserType) {
  return parserType === PARSER_TYPES.GOOGLE_DOC;
}
