/**
 * 1. remove nbsp & zwnj
 * 2. remove dashes
 * 3. remove other chars
 * @param {*} str
 * @returns
 */
export default function removeHTMLSpaces(str: string): string {
  return str
    .trim()
    .replace(/(&nbsp;)+|(&zwnj;)+/gi, '')
    .replace(/[\u200B-\u200D\uFEFF]+/g, '')
    .replace(/[\u0080|\u008C|\u00E2|\u00C2|\u00A0|\u003A]+/g, ' ');
}
