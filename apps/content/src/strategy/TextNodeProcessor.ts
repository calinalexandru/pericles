/* eslint-disable class-methods-use-this */
import { NodeProcessingStrategy, ProcessResult, } from '@/interfaces/api';
import {
  alterNode,
  findNextSiblingWithParents,
  getInnerText,
  getSentencesFromText,
  isMaxText,
  isMinText,
  isTextNode,
  removeHTMLSpaces,
} from '@pericles/util';

export default class TextNodeProcessor implements NodeProcessingStrategy {

  shouldProcess(node: Node, isVisible: boolean): boolean {
    return (
      isVisible &&
      isTextNode(node) &&
      isMinText(removeHTMLSpaces(getInnerText(node.nodeValue || '')))
    );
  }

  process(node: Text): ProcessResult {
    console.log('TextNodeProcessor.process', node);
    let nextNode: Node | null = null;
    let parents: Node[] = [];
    let nextAfterIframe: Node | null = null;
    let firstParagraph: { text: string } | null = null;
    let iframeBlocked = false;

    if (
      node.nodeValue &&
      isMaxText(removeHTMLSpaces(getInnerText(node.nodeValue)))
    ) {
      const sentences = getSentencesFromText(node.nodeValue) || [];
      [ firstParagraph, ] = sentences;
      parents = [];

      // Ensure nodeValue is defined and is a string
      const nodeValueLength = node.nodeValue.length;

      // Ensure firstParagraph.text is defined and is a string
      const firstParagraphLength =
        firstParagraph !== null ? firstParagraph.text.length : 0;

      nextNode = node.splitText(
        firstParagraph && nodeValueLength >= firstParagraphLength
          ? firstParagraphLength
          : Math.floor(nodeValueLength / 2)
      );
    } else {
      const result = findNextSiblingWithParents(node);
      console.log('TextNodeProcessor.process.result', result);
      if (result !== null && 'next' in result && 'parents' in result) {
        ({ next: nextNode, parents, nextAfterIframe, iframeBlocked, } = result);
      }
    }

    // const nodeText = getInnerText(node.nodeValue || '');
    // walkerInstance.pushNode(nodeText, node);
    const domAlterations: (key: number) => void = (key: number) => {
      console.log('TextNodeProcessor.process.domAlterations', node, key);
      alterNode(node, key);
    };

    if (firstParagraph) {
      console.log(
        'util.processTextNode.pushAndClearBuffer invokation',
        firstParagraph,
        parents
      );
      // walkerInstance.pushAndClearBuffer();
    }

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