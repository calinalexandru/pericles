import { ATTRIBUTES, } from '@pericles/constants';

export default function alterRect(el, key) {
  if (!el) return;
  el.setAttribute(ATTRIBUTES.ATTRS.SECTION, key);
}
