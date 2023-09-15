export default function isElementNode(el: Node): el is HTMLElement {
  return el instanceof HTMLElement;
}
