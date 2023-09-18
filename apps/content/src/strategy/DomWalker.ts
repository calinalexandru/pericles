import { ATTRIBUTES, SectionType, } from '@pericles/constants';
import {
  cleanupSections,
  determineVisibility,
  getPosition,
  isMinText,
  isNode,
} from '@pericles/util';

import AnyNodeProcessor from './AnyNodeProcessor';
import ElementNodeProcessor from './ElementNodeProcessor';
import {
  IDOMWalker,
  NodeProcessingStrategy,
  ProcessResult,
  WalkTheDOMResult,
} from './IDom';
import TextNodeProcessor from './TextNodeProcessor';

export default class DOMWalker implements IDOMWalker {

  startingNode: Node | null = null;

  lastDomAlterationId: number;

  isUserTriggered: boolean;

  verticalStartOffset: number;

  processors: NodeProcessingStrategy[];

  temporarySentence: SectionType | null = null;

  sections: SectionType[] = [];

  isVisible: boolean;

  results: WalkTheDOMResult[] = [];

  domAlterationsBatch: { fn: (key: number) => void; data: number }[] = [];

  continuationNodeAfterIframe: Node | null;

  constructor() {
    this.processors = [
      new TextNodeProcessor(),
      new ElementNodeProcessor(),
      new AnyNodeProcessor(),
    ];
  }

  setup(
    startingNode: Node | null,
    lastDomAlterationId: number,
    isUserTriggered: boolean,
    verticalStartOffset: number
  ): void {
    this.startingNode = startingNode;
    this.lastDomAlterationId = lastDomAlterationId;
    this.verticalStartOffset = verticalStartOffset;
    this.isUserTriggered = isUserTriggered;
    this.isVisible = false;
    this.sections = [];
    this.results = [];
    this.temporarySentence = null;
  }

  appendSentenceBuffer(section: SectionType): void {
    this.temporarySentence = {
      text: `${this.temporarySentence?.text || ''}${section.text}`,
      pos: section.pos,
    };
  }

  pushNode(text: string, node: HTMLElement | Text): void {
    const pos = getPosition(node, true);
    const outer = { text, pos, };
    this.appendSentenceBuffer(outer);
  }

  pushSection(node: HTMLElement, text: string): void {
    const pos = getPosition(node);
    this.sections.push({ node, text, pos, });
  }

  finalizeSentenceBuffer(): void {
    if (!this.temporarySentence) return;

    if (isMinText(this.temporarySentence.text)) {
      this.sections.push(this.temporarySentence);
    } else {
      cleanupSections(this.lastDomAlterationId + this.sections.length);
    }
    this.temporarySentence = null;
  }

  setAndCacheIsVisibleNode(node: Node): void {
    this.isVisible = determineVisibility(
      node,
      this.verticalStartOffset,
      this.isUserTriggered
    );
  }

  processNode(node: Node): ProcessResult {
    this.setAndCacheIsVisibleNode(node);
    for (const processor of this.processors) {
      if (processor.shouldProcess(node, this.isVisible)) {
        return processor.process(node, this.isVisible);
      }
    }
    return { nextNode: null, nextAfterIframe: null, iframeBlocked: false, };
  }

  handleNodeAfterIframe(): void {
    if (this.continuationNodeAfterIframe) {
      this.startingNode = this.continuationNodeAfterIframe;
      this.continuationNodeAfterIframe = null;
    }
  }

  processAndHandleNode(node: Node): {
    nextNode: Node | null;
    iframeBlocked: boolean;
  } {
    const {
      finalizeSentenceBufferAfter,
      finalizeSentenceBufferBefore,
      nodeToAdd,
      domAlterations,
      sectionToAdd,
      nextNode,
      nextAfterIframe,
      iframeBlocked: processorIframeBlocked,
    } = this.processNode(node);

    if (finalizeSentenceBufferBefore) {
      this.finalizeSentenceBuffer();
    }

    if (domAlterations) {
      this.domAlterationsBatch.push({
        fn: domAlterations,
        data: this.lastDomAlterationId + this.sections.length,
      });
    }

    if (sectionToAdd) {
      this.pushSection(sectionToAdd.node, sectionToAdd.text);
    }

    if (nodeToAdd) {
      this.pushNode(nodeToAdd.text, nodeToAdd.node);
    }

    if (finalizeSentenceBufferAfter) {
      this.finalizeSentenceBuffer();
    }

    if (processorIframeBlocked && nextAfterIframe) {
      this.continuationNodeAfterIframe = nextAfterIframe;
    }

    return { nextNode, iframeBlocked: processorIframeBlocked, };
  }

  pushNextNodeOntoStack(stack: (Node | null)[], nextNode: Node | null): void {
    if (
      isNode(nextNode) &&
      this.sections.length < ATTRIBUTES.MISC.MIN_SECTIONS
    ) {
      stack.push(nextNode);
    }
  }

  processBatchedDomAlterations(): void {
    for (const alteration of this.domAlterationsBatch) {
      alteration.fn(alteration.data);
    }
    this.domAlterationsBatch = [];
  }

  finalizeWalk(
    nextNode: Node | null,
    end?: boolean,
    iframeBlocked?: boolean
  ): WalkTheDOMResult {
    this.finalizeSentenceBuffer();

    this.processBatchedDomAlterations();

    return {
      out: this.sections,
      iframeBlocked: iframeBlocked || false,
      end: end || !nextNode,
    };
  }

  walk(): WalkTheDOMResult {
    this.handleNodeAfterIframe();

    const stack: (Node | null)[] = [ this.startingNode, ];
    let nextNode: Node | null = null;

    while (stack.length) {
      const node = stack.pop();

      if (!isNode(node)) return this.finalizeWalk(null);

      const {
        nextNode: processorNextNode,
        iframeBlocked: processorIframeBlocked,
      } = this.processAndHandleNode(node);

      this.pushNextNodeOntoStack(stack, processorNextNode);

      if (processorIframeBlocked) return this.finalizeWalk(null, true, true);

      nextNode = processorNextNode;
    }

    return this.finalizeWalk(nextNode);
  }

}
