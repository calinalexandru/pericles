import { ATTRIBUTES, } from '@pericles/constants';

export default function isMaxText(text) {
  return text?.length >= ATTRIBUTES.MISC.MAX_TEXT;
}
