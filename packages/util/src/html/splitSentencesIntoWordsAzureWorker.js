import wrapWordTagAzure from './wrapWordTagAzure';

export default function splitSentencesIntoWordsAzureWorker({
  sections = [],
  wordList,
  wordIndex = 0,
}) {
  // console.log(
  //   'splitSentencesIntoWordsAzureWorker',
  //   sections,
  //   wordList,
  //   wordIndex
  // );
  const node = sections[0].childNodes[0];
  // console.log('splitSentencesIntoWordsAzureWorker.node', node);
  if (node) {
    const out = wrapWordTagAzure({
      node,
      wordList,
      wordIndex,
    });
    const sectionsSliced = sections.slice(1);
    if (sectionsSliced.length) {
      splitSentencesIntoWordsAzureWorker({
        sections: sectionsSliced,
        wordList: out.wordList,
        wordIndex: out.wordIndex,
      });
    }
  }
}
