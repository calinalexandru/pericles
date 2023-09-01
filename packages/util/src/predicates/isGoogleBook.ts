import { PARSER_TYPES, ParserTypes, } from '@pericles/constants';

export default function isGoogleBook(parserType: ParserTypes): boolean {
  return parserType === PARSER_TYPES.GOOGLE_BOOK;
}
