import getSelfIframes from './getSelfIframes';
import sectionQuerySelector from './sectionQuerySelector';
import splitSentencesIntoWordsAzureWorker from './splitSentencesIntoWordsAzureWorker';

export default function splitSentencesIntoWordsAzure({ sectionId, wordList, }) {
  const query = sectionQuerySelector(sectionId);
  const sections = Array.from(document.querySelectorAll(query));
  const sectionsInFrames = getSelfIframes().reduce(
    (acc, iframe) => [
      ...acc,
      ...Array.from(iframe.document.querySelectorAll(query)),
    ],
    []
  );

  splitSentencesIntoWordsAzureWorker({
    sections: [ ...sections, ...sectionsInFrames, ],
    wordList,
  });
}
