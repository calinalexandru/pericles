export default function removeLineBreaks(str: string): string {
  return str.replace(/[\n\r]+/gm, '').trim();
}
