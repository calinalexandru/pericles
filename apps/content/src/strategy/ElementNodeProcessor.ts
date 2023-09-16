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
  isElementNode,
  validateElementNode,
} from '@pericles/util';

export default class ElementNodeProcessor implements NodeProcessingStrategy {

  shouldProcess(node: Node, walkerInstance: IDOMWalker): boolean {
    return (
      isElementNode(node) &&
      determineVisibility(
        node,
        walkerInstance.playFromCursor,
        walkerInstance.userGenerated
      ) &&
      validateElementNode(node)
    );
  }

  process(node: HTMLElement, walkerInstance: IDOMWalker): ProcessResult {
    console.log('ElementNodeProcessor.process', node);
    let nextAfterIframe: Node | null = null;
    let nextNode: Node | null = null;

    walkerInstance.pushAndClearBuffer();
    alterDom(node, walkerInstance.lastKey + walkerInstance.sections.length);
    walkerInstance.pushSection(
      node,
      getInnerText(node.innerText || node.textContent || '')
    );
    const result = findNextSiblingWithParents(node);
    if (result !== null && 'next' in result) {
      ({ next: nextNode, nextAfterIframe = null, } = result);
    }

    return { nextNode, nextAfterIframe, };
  }

}
