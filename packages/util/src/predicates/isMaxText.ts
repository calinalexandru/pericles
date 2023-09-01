import { ATTRIBUTES, } from '@pericles/constants';

export default function isMaxText(text: string): boolean {
  return text?.length >= ATTRIBUTES.MISC.MAX_TEXT;
}
