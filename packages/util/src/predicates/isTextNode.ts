export default function isTextNode(node: Node): node is Text {
  return node instanceof Text;
}
