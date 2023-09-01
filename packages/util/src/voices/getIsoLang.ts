import { ISO_LANGS, IsoLangType, } from '@pericles/constants';

export default function getIsoLang(lang: string): IsoLangType {
  return ISO_LANGS?.[lang] || ISO_LANGS.en;
}
