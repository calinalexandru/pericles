import getGoogleBookEditor from '../google-docs/getGoogleBookEditor';
import getGoogleDocsEditor from '../google-docs/getGoogleDocsEditor';
import isGoogleBook from '../predicates/isGoogleBook';
import isGoogleDocs from '../predicates/isGoogleDocs';
import isGoogleDocsSvg from '../predicates/isGoogleDocsSvg';

export default function getViewportByDocType(window, parserType) {
  if (isGoogleDocs(parserType) || isGoogleDocsSvg(parserType))
    return getGoogleDocsEditor(window);
  if (isGoogleBook(parserType)) return getGoogleBookEditor(window);
  return window;
}
