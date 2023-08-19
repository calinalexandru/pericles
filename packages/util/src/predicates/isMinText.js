import { ATTRIBUTES, } from '@pericles/constants';

export default function isMinText(text) {
  return text?.length >= ATTRIBUTES.MISC.MIN_TEXT;
}
