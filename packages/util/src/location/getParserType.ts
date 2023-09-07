import { PARSER_TYPES, ParserTypes, } from '@pericles/constants';

import isGoogleBookDocument from './isGoogleBookDocument';
import isGoogleDocsDocument from './isGoogleDocsDocument';
import isGoogleFormsDocumentSvg from './isGoogleDocsDocumentSvg';
import isGoogleFormsDocument from './isGoogleFormsDocument';
import isGrammarlyAppHost from './isGrammarlyAppHost';

export default function getParserType(window: Window): ParserTypes {
  return (
    (isGrammarlyAppHost(window) && PARSER_TYPES.GRAMMARLY_APP) ||
    (isGoogleBookDocument(window) && PARSER_TYPES.GOOGLE_BOOK) ||
    (isGoogleFormsDocument(window) && PARSER_TYPES.GOOGLE_FORM) ||
    (isGoogleFormsDocumentSvg(window) && PARSER_TYPES.GOOGLE_DOC_SVG) ||
    (isGoogleDocsDocument(window) && PARSER_TYPES.GOOGLE_DOC) ||
    PARSER_TYPES.DEFAULT
  );
}
