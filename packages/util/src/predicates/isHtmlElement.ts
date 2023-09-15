export default function isHTMLElement(obj: unknown): obj is HTMLElement {
  return obj instanceof HTMLElement;
}
