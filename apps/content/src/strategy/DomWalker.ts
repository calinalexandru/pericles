import {
  IDOMWalker,
  NodeProcessingStrategy,
  ProcessResult,
} from '@/interfaces/api';
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
import TextNodeProcessor from './TextNodeProcessor';

interface WalkTheDOMResult {
  out: SectionType[];
  iframeBlocked: boolean;
  end: boolean;
}

export default class DOMWalker implements IDOMWalker {

  public node: Node | null = null;

  public lastKey: number;

  public userGenerated: boolean;

  public playFromCursor: number;

  public processors: NodeProcessingStrategy[];

  public sentenceBuffer: SectionType | null = null;

  public sections: SectionType[] = [];

  public results: WalkTheDOMResult[] = [];

  private nodeAfterIframe: Node | null;

  domAlterationsBatch: { fn: (key: number) => void; data: number }[] = [];

  constructor() {
    this.processors = [
      new TextNodeProcessor(),
      new ElementNodeProcessor(),
      new AnyNodeProcessor(),
    ];
    this.reset();
  }

  reset(): void {
    this.node = null;
    this.playFromCursor = 0;
    this.lastKey = 0;
    this.userGenerated = false;
    this.sections = [];
    this.results = [];
    this.sentenceBuffer = null;
  }

  appendSentenceBuffer(section: SectionType): void {
    this.sentenceBuffer = {
      text: `${this.sentenceBuffer?.text || ''}${section.text}`,
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
    if (!this.sentenceBuffer) return;

    if (isMinText(this.sentenceBuffer.text)) {
      this.sections.push(this.sentenceBuffer);
    } else {
      cleanupSections(this.lastKey + this.sections.length);
    }
    this.sentenceBuffer = null;
  }

  private isVisible(node: Node) {
    return determineVisibility(node, this.playFromCursor, this.userGenerated);
  }

  private processNode(node: Node): ProcessResult {
    for (const processor of this.processors) {
      if (processor.shouldProcess(node, this.isVisible(node))) {
        return processor.process(node, this.isVisible(node));
      }
    }
    return { nextNode: null, nextAfterIframe: null, iframeBlocked: false, };
  }

  handleNodeAfterIframe(): void {
    if (this.nodeAfterIframe) {
      this.node = this.nodeAfterIframe;
      this.nodeAfterIframe = null;
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
        data: this.lastKey + this.sections.length,
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
      this.nodeAfterIframe = nextAfterIframe;
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

    const stack: (Node | null)[] = [ this.node, ];
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
