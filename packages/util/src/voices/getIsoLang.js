import { propOr, } from 'ramda';

import { ISO_LANGS, } from '@pericles/constants';

export default function getIsoLang(lang) {
  return propOr({}, lang, ISO_LANGS);
}
