export default function removeLineBreaks(str) {
  return str.replace(/[\n\r]+/gm, '').trim();
}
