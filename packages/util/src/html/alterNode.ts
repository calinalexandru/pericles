import { ATTRIBUTES, } from '@pericles/constants';

export default function alterNode(node: Element, key: number): void {
  if (!node) return;
  const myEl = document.createElement(ATTRIBUTES.TAGS.SECTION);
  myEl.setAttribute(ATTRIBUTES.ATTRS.SECTION, String(key));
  node.after(myEl);
  myEl.appendChild(node);
}
