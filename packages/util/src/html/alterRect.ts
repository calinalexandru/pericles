import { ATTRIBUTES, } from '@pericles/constants';

export default function alterRect(el: Element, key: number) {
  if (!el) return;
  el.setAttribute(ATTRIBUTES.ATTRS.SECTION, String(key));
}
