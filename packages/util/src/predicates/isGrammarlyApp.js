import { PARSER_TYPES, } from '@pericles/constants';

export default function isGrammarlyApp(parserType) {
  return parserType === PARSER_TYPES.GRAMMARLY_APP;
}
