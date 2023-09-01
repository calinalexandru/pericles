/* eslint-disable no-useless-escape */
/**
 * Get readable text
 * 1. remove newlines
 * 2. remove html tags, keep text
 * 3. remove annotations like "[1], [2]"
 * 4. remove outer paranthesis
 * 5. trim the result
 */
// export default function getInnerText(text) {
//   return text
//     .replace(/[\n\r]+/gim, '')
//     .replace(/<\/?[^>]+>/gim, '')
//     .replace(/(\[([0-9]+)\])/gim, '')
//     .replace(/^(\[|\()([^\])]+)(\]|\))$/gim, '$2')
//     .trim();
//   // .replace(/^(\[|\()([^\])]+)(\]|\))$/gim, '$2');
// }

export default function getInnerText(text: string): string {
  return text.replace(/([\n\r]+)+|(<\/?[^>]+>)+|(\[[0-9]+\])+/gim, '').trim();
}
