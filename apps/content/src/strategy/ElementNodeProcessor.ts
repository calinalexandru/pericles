/* eslint-disable class-methods-use-this */
import { NodeProcessingStrategy, ProcessResult, } from '@/interfaces/api';
import {
  alterDom,
  findNextSiblingWithParents,
  getInnerText,
  isHtmlElement,
  validateElementNode,
} from '@pericles/util';

export default class ElementNodeProcessor implements NodeProcessingStrategy {

  shouldProcess(node: Node, isVisible: boolean): boolean {
    return isVisible && isHtmlElement(node) && validateElementNode(node);
  }

  process(node: HTMLElement): ProcessResult {
    let nextAfterIframe: Node | null = null;
    let nextNode: Node | null = null;
    let iframeBlocked: boolean = false;

    // walkerInstance.pushAndClearBuffer();
    // alterDom(node, walkerInstance.lastKey + walkerInstance.sections.length);
    // walkerInstance.pushSection(
    // node,
    // getInnerText(node.innerText || node.textContent || '')
    // );
    const domAlterations: (key: number) => void = (key) => {
      console.log('ElementNodeProcessor.process.domAlterations', node, key);
      alterDom(node, key);
    };
    const result = findNextSiblingWithParents(node);
    console.log('ElementNodeProcessor.process', node, result);
    if (result !== null && 'next' in result) {
      ({ next: nextNode, nextAfterIframe = null, iframeBlocked, } = result);
    }

    return {
      finalizeSentenceBufferBefore: true,
      domAlterations,
      sectionToAdd: {
        text: getInnerText(node.innerText || node.textContent || ''),
        node,
      },
      nextNode,
      nextAfterIframe,
      iframeBlocked,
    };
  }

}
