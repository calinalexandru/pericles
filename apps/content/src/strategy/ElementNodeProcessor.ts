/* eslint-disable class-methods-use-this */
import {
  IDOMWalker,
  NodeProcessingStrategy,
  ProcessResult,
} from '@/interfaces/api';
import {
  alterDom,
  determineVisibility,
  findNextSiblingWithParents,
  getInnerText,
  isHtmlElement,
  validateElementNode,
} from '@pericles/util';

export default class ElementNodeProcessor implements NodeProcessingStrategy {

  shouldProcess(node: Node, walkerInstance: IDOMWalker): boolean {
    return (
      isHtmlElement(node) &&
      determineVisibility(
        node,
        walkerInstance.playFromCursor,
        walkerInstance.userGenerated
      ) &&
      validateElementNode(node)
    );
  }

  process(node: HTMLElement, walkerInstance: IDOMWalker): ProcessResult {
    let nextAfterIframe: Node | null = null;
    let nextNode: Node | null = null;
    let iframeBlocked: boolean = false;

    walkerInstance.pushAndClearBuffer();
    alterDom(node, walkerInstance.lastKey + walkerInstance.sections.length);
    walkerInstance.pushSection(
      node,
      getInnerText(node.innerText || node.textContent || '')
    );
    const result = findNextSiblingWithParents(node);
    console.log('ElementNodeProcessor.process', node, result);
    if (result !== null && 'next' in result) {
      ({ next: nextNode, nextAfterIframe = null, iframeBlocked, } = result);
    }

    return { nextNode, nextAfterIframe, iframeBlocked, };
  }

}
