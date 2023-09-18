/* eslint-disable class-methods-use-this */
import {
  findNextSiblingWithParents,
  isSkippableByDesign,
  isWikipedia,
} from '@pericles/util';

import { NodeProcessingStrategy, ProcessResult, } from './IDom';

export default class AnyNodeProcessor implements NodeProcessingStrategy {

  shouldProcess(node: Node): boolean {
    return node instanceof Node;
  }

  process(node: Node, isVisible: boolean): ProcessResult {
    const nextSiblingResult = findNextSiblingWithParents(node);
    console.log('AnyNodeProcessor.process', node);
    if (
      nextSiblingResult.next &&
      ((isWikipedia() && isSkippableByDesign(node)) || !isVisible)
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
