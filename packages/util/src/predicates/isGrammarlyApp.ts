import { PARSER_TYPES, ParserTypes, } from '@pericles/constants';

export default function isGrammarlyApp(parserType: ParserTypes) {
  return parserType === PARSER_TYPES.GRAMMARLY_APP;
}
