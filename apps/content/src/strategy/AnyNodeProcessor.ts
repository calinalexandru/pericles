/* eslint-disable class-methods-use-this */
import {
  IDOMWalker,
  NodeProcessingStrategy,
  ProcessResult,
} from '@/interfaces/api';
import {
  determineVisibility,
  findNextSiblingWithParents,
  isSkippableByDesign,
  isWikipedia,
} from '@pericles/util';

export default class AnyNodeProcessor implements NodeProcessingStrategy {

  shouldProcess(node: Node, walkerInstance: IDOMWalker): boolean {
    return node instanceof Node;
  }

  process(node: Node, walkerInstance: IDOMWalker): ProcessResult {
    const nextSiblingResult = findNextSiblingWithParents(node);
    console.log('AnyNodeProcessor.process', node);
    const isVisibleNodeOrText = determineVisibility(
      node,
      walkerInstance.playFromCursor,
      walkerInstance.userGenerated
    );
    if (
      nextSiblingResult.next &&
      ((isWikipedia() && isSkippableByDesign(node)) || !isVisibleNodeOrText)
    ) {
      return {
        nextNode: nextSiblingResult.next,
        nextAfterIframe: nextSiblingResult.nextAfterIframe,
        iframeBlocked: nextSiblingResult.iframeBlocked,
      };
    }

    return {
      nextNode: node.childNodes[0] || nextSiblingResult.next,
      nextAfterIframe: nextSiblingResult.nextAfterIframe,
      iframeBlocked: nextSiblingResult.iframeBlocked,
    };
  }

}
