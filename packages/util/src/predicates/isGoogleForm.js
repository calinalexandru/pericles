import { PARSER_TYPES, } from '@pericles/constants';

export default function isGoogleForm(parserType) {
  return parserType === PARSER_TYPES.GOOGLE_FORM;
}
