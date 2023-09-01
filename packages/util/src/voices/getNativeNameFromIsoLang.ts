import { IsoLangType, } from '@pericles/constants';

export default function getNativeNameFromIsoLang(lang: IsoLangType): string {
  return lang?.nativeName || '';
}
