export default function isParagraph(el: HTMLElement): boolean {
  return [ 'P', 'LI', 'DD', 'DT', 'BLOCKQUOTE', 'TR', ].includes(el.tagName);
}
