import { propOr, } from 'ramda';

export default function getNativeNameFromIsoLang(lang) {
  return propOr('', 'nativeName', lang);
}
