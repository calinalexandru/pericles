export default function removeZeroWidthNonJoiner(str: string): string {
  return str.replace(/[\u200B-\u200D\uFEFF]+/g, '');
}
