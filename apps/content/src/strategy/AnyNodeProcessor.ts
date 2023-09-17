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
    console.log('AnyNodeProcessor.process', node);
    const nextSiblingResult = findNextSiblingWithParents(node);
    const isVisibleNodeOrText = determineVisibility(
      node,
      walkerInstance.playFromCursor,
      walkerInstance.userGenerated
    );
    const result: any =
      (isWikipedia() && isSkippableByDesign(node)) || !isVisibleNodeOrText
        ? nextSiblingResult
        : node.childNodes[0]
          ? { next: node.childNodes[0], }
          : nextSiblingResult;

    const { next: nextNode, nextAfterIframe, iframeBlocked, } = result;

    return { nextNode, nextAfterIframe, iframeBlocked, };
  }

}
