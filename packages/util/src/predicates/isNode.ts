export default function isNode(node: unknown): node is Node {
  return node instanceof Node;
}
