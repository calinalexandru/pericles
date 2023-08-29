export default function replaceLineBreaks(str: string): string {
  return str.replace(/[\n\r]+/gm, '  ');
}
