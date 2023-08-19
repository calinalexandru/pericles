export default function removeZeroWidthNonJoiner(str) {
  return str.replace(/[\u200B-\u200D\uFEFF]+/g, '');
}
