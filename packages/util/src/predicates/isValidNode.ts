export default function isValidNode(node: HTMLElement | null): boolean {
  return !!node?.nodeType;
}
