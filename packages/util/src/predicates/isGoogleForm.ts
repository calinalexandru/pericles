import { PARSER_TYPES, ParserTypes, } from '@pericles/constants';

export default function isGoogleForm(parserType: ParserTypes): boolean {
  return parserType === PARSER_TYPES.GOOGLE_FORM;
}
