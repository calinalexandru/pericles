export default function isElementNode(el: Node): el is Element {
  return el instanceof Element;
}
