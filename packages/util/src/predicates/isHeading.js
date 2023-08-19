// should only accept node type
export default function isHeading(el) {
  return [ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', ].includes(el.tagName);
}
