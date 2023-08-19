export default function isParagraph(el) {
  return [ 'P', 'LI', 'DD', 'DT', 'BLOCKQUOTE', 'TR', ].includes(el.tagName);
}
