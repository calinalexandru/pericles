import isGoogleBook from './isGoogleBook';
import isGoogleDocs from './isGoogleDocs';
import isGoogleDocsSvg from './isGoogleDocsSvg';
import isGoogleForm from './isGoogleForm';

export default function isGoogleUtility(parserType) {
  return (
    isGoogleBook(parserType) ||
    isGoogleDocs(parserType) ||
    isGoogleDocsSvg(parserType) ||
    isGoogleForm(parserType)
  );
}
