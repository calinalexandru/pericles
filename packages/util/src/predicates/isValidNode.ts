export default function isValidNode(node: unknown): node is Node {
  return node instanceof Node;
}
