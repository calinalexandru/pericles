import { ParserTypes, } from '@pericles/constants';

import getGoogleBookEditor from '../google-docs/getGoogleBookEditor';
import getGoogleDocsEditor from '../google-docs/getGoogleDocsEditor';
import isGoogleBook from '../predicates/isGoogleBook';
import isGoogleDocs from '../predicates/isGoogleDocs';
import isGoogleDocsSvg from '../predicates/isGoogleDocsSvg';

export default function getViewportByDocType(
  window: Window,
  parserType: ParserTypes
): HTMLElement | Window {
  if (isGoogleDocs(parserType) || isGoogleDocsSvg(parserType))
    return getGoogleDocsEditor();
  if (isGoogleBook(parserType)) return getGoogleBookEditor(window);
  return window;
}
