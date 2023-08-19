import getInnerText from '../string-work/getInnerText';

import alterNodeWord from './alterNodeWord';

export default function wrapWordTagAzure({
  node,
  wordIndex: charIndex,
  wordList,
}) {
  if (!node || !node.nodeValue || !wordList.length)
    return { wordList, wordIndex: charIndex, };

  let wordListSliced = wordList;
  let newCharIndex = charIndex;
  let newNode = node;
  let oldNode = node;
  let splitIndex = 0;
  let out = {};
  const word = wordList[0];
  splitIndex = newNode.nodeValue.indexOf(word.text) + word.wordLength;

  if (newNode.nodeValue.length >= splitIndex) {
    newNode = oldNode.splitText(splitIndex);
    alterNodeWord(oldNode, word.index, word.audio);
    newCharIndex = word.index;
    oldNode = newNode;
    wordListSliced = wordListSliced.slice(1);

    if (getInnerText(newNode.nodeValue).length) {
      out = wrapWordTagAzure({
        node: newNode,
        wordIndex: newCharIndex,
        wordList: wordListSliced,
      });
      wordListSliced = out.wordList;
      newCharIndex = out.wordIndex;
    }
  }
  return {
    wordList: wordListSliced,
    wordIndex: newCharIndex,
  };
}
