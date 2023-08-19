import { ATTRIBUTES, } from '@pericles/constants';

export default function alterNode(node, key) {
  if (!node) return;
  const myEl = document.createElement(ATTRIBUTES.TAGS.SECTION);
  myEl.setAttribute(ATTRIBUTES.ATTRS.SECTION, key);
  node.after(myEl);
  myEl.appendChild(node);
}
