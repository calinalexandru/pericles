import { sort, } from 'ramda';

import alterNodeWord from './alterNodeWord';

const sortFunc = (a, b) => b - a;
export default function wrapWordTag(node, charIndex, jp = false) {
  if (!node || !node.nodeValue) return charIndex;
  const { nodeValue, } = node;
  const leftTrimmedNodeValue = nodeValue.trimLeft();
  const leftTrim = nodeValue.length - leftTrimmedNodeValue.length;
  const chars = leftTrimmedNodeValue.split('');
  let squareBracket = false;
  const splitIndexMap = jp
    ? sort(
      sortFunc,
      chars.map((ch, key) => key + 1)
    )
    : sort(
      sortFunc,
      chars
        .map((char, key) => {
          if (char === '[') squareBracket = true;
          if (char === ']') squareBracket = false;
          const next = chars[key + 1];
          const prev = chars[key - 1];
          return next &&
              !squareBracket &&
              char === ' ' &&
              next !== ' ' &&
              prev !== ' '
            ? key
            : null;
        })
        .filter((char) => char > 0)
    );
  splitIndexMap.forEach((splitIndex) => {
    alterNodeWord(
      node.splitText(leftTrim + splitIndex),
      charIndex + splitIndex + 1
    );
  });
  if (!squareBracket && !node.nodeValue.match(/\[([0-9]+)\]/gim))
    alterNodeWord(node, charIndex);
  return (splitIndexMap[0] || 0) + charIndex + 1 + (node.nodeValue.length || 0);
}
