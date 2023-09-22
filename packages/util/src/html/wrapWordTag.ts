import alterNodeWord from './alterNodeWord';

function extractSplitIndices(nodeValue: string): number[] {
  let squareBracket = false;
  const indices: number[] = [];

  nodeValue.split('').forEach((char, index, chars) => {
    if (char === '[') squareBracket = true;
    if (char === ']') squareBracket = false;

    const nextChar = chars[index + 1];
    const prevChar = chars[index - 1];

    if (
      nextChar &&
      !squareBracket &&
      char === ' ' &&
      nextChar !== ' ' &&
      prevChar !== ' '
    ) {
      indices.push(index);
    }
  });

  return indices;
}

function containsSquareBrackets(nodeValue: string): boolean {
  return !!nodeValue.match(/\[([0-9]+)\]/gim);
}

export default function wrapWordTag(
  node: Text,
  charIndex: number = 0,
  jp: boolean = false
): number {
  // Return early if the node does not have a valid value.
  if (!node || !node.nodeValue) return charIndex;

  const { nodeValue, } = node;
  const leftTrimmedNodeValue = nodeValue.trimLeft();
  const leftTrim = nodeValue.length - leftTrimmedNodeValue.length;

  const splitIndices = extractSplitIndices(leftTrimmedNodeValue);

  const splitIndexMap = jp
    ? Array.from(
      { length: leftTrimmedNodeValue.length, },
      (_, index) => index + 1
    )
    : splitIndices;

  splitIndexMap.sort((a, b) => b - a); // Sort indices in descending order.

  splitIndexMap.forEach((splitIndex) => {
    alterNodeWord(
      node.splitText(leftTrim + splitIndex),
      charIndex + splitIndex + 1
    );
  });

  if (!containsSquareBrackets(nodeValue)) {
    alterNodeWord(node, charIndex);
  }

  return (splitIndexMap[0] || 0) + charIndex + 1 + (nodeValue.length || 0);
}
