import { ATTRIBUTES, } from '@pericles/constants';

export default function isMinText(text: string): boolean {
  return text?.length >= ATTRIBUTES.MISC.MIN_TEXT;
}
