/* eslint-disable class-methods-use-this */
import {
  alterNode,
  combineSmallSentences,
  findNextSiblingWithIframe,
  getInnerText,
  getSentencesFromText,
  isMaxText,
  isMinText,
  isTextNode,
  removeHTMLSpaces,
} from '@pericles/util';

import { NodeProcessingStrategy, ProcessResult, } from './IDom';

export default class TextNodeProcessor implements NodeProcessingStrategy {

  private remainingSentences: { text: string }[] = [];

  shouldProcess(node: Node, isVisible: boolean): boolean {
    return (
      isVisible &&
      isTextNode(node) &&
      isMinText(removeHTMLSpaces(getInnerText(node.nodeValue || '')))
    );
  }

  process(node: Text): ProcessResult {
    console.log('TextNodeProcessor.process', node.nodeValue);
    let nextNode: Node | null = null;
    let nextAfterIframe: Node | null = null;
    let firstParagraph: { text: string } | null = null;
    let iframeBlocked = false;

    if (
      node.nodeValue &&
      isMaxText(removeHTMLSpaces(getInnerText(node.nodeValue)))
    ) {
      if (this.remainingSentences.length === 0) {
        // If we don't have any sentences cached, get them all
        this.remainingSentences = combineSmallSentences(
          getSentencesFromText(node.nodeValue) || []
        );
      }

      // console.log(
      //   'TextNodeProcessor.process.remainingSentences',
      //   JSON.stringify(this.remainingSentences.map(({ text, }) => text))
      // );

      const currentSentence = this.remainingSentences.shift()?.text || '';

      if (currentSentence) {
        nextNode = node.splitText(currentSentence.length);
        // Here, we are going to check the first sentence for the next process cycle
        [ firstParagraph, ] = this.remainingSentences;
      }
    } else {
      const result = findNextSiblingWithIframe(node);
      console.log('TextNodeProcessor.process.result', result);
      if (result !== null && 'next' in result) {
        ({ next: nextNode, nextAfterIframe, iframeBlocked, } = result);
      }
    }

    const domAlterations: (key: number) => void = (key: number) => {
      console.log('TextNodeProcessor.process.domAlterations', node, key);
      alterNode(node, key);
    };

    return {
      domAlterations,
      finalizeSentenceBufferAfter: !!firstParagraph,
      nodeToAdd: {
        text: getInnerText(node.nodeValue || ''),
        node,
      },
      iframeBlocked,
      nextNode,
      nextAfterIframe: nextAfterIframe || null,
    };
  }

}
