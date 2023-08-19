export default function replaceLineBreaks(str) {
  return str.replace(/[\n\r]+/gm, '  ');
}
