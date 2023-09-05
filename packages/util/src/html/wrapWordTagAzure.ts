import getInnerText from '../string-work/getInnerText';

import alterNodeWord from './alterNodeWord';

type WordList = {
  text: string;
  index: number;
  audio: number;
  wordLength: number;
};

export default function wrapWordTagAzure({
  node,
  wordIndex: charIndex,
  wordList,
}: {
  node: Text;
  wordIndex: number;
  wordList: WordList[];
}): {
  wordList: WordList[];
  wordIndex: number;
} {
  if (!node || !node.nodeValue || !wordList.length)
    return { wordList, wordIndex: charIndex, };

  let wordListSliced = wordList;
  let newCharIndex = charIndex;
  let newNode: any = node;
  let oldNode = node;
  let splitIndex = 0;
  let out: any = {};
  const word = wordList[0];
  splitIndex = newNode.nodeValue.indexOf(word.text) + word.wordLength;

  if (newNode?.nodeValue?.length >= splitIndex) {
    newNode = oldNode.splitText(splitIndex);
    alterNodeWord(oldNode, word.index, word.audio);
    newCharIndex = word.index;
    oldNode = newNode;
    wordListSliced = wordListSliced.slice(1);

    if (getInnerText(newNode.nodeValue || '').length) {
      out = wrapWordTagAzure({
        node: newNode,
        wordIndex: newCharIndex,
        wordList: wordListSliced,
      });
      wordListSliced = out.wordList;
      newCharIndex = out.wordIndex;
    }
  }

  console.log('wrapWordTagAzure', wordListSliced);

  return {
    wordList: wordListSliced,
    wordIndex: newCharIndex,
  };
}
