import { PARSER_TYPES, } from '@pericles/constants';

export default function isGoogleBook(parserType) {
  return parserType === PARSER_TYPES.GOOGLE_BOOK;
}
