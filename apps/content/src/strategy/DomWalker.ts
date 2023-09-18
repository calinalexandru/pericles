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

  pushAndClearBuffer(): void {
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

  walk(): WalkTheDOMResult {
    if (this.nodeAfterIframe) {
      this.node = this.nodeAfterIframe;
      this.nodeAfterIframe = null;
    }

    const stack: (Node | null)[] = [ this.node, ];
    let nextNode: Node | null = null;
    const iframeBlocked = false;
    while (stack.length) {
      const node = stack.pop();

      if (!isNode(node)) {
        this.pushAndClearBuffer();
        return {
          iframeBlocked: false,
          out: this.sections,
          end: true,
        };
      }

      const {
        pushAndClearBufferAfter,
        pushAndClearBufferBefore,
        nodeToAdd,
        domAlterations,
        sectionToAdd,
        nextNode: processorNextNode,
        nextAfterIframe,
        iframeBlocked: processorIframeBlocked,
      } = this.processNode(node);

      if (pushAndClearBufferBefore) {
        this.pushAndClearBuffer();
      }

      if (domAlterations) {
        domAlterations(this.lastKey + this.sections.length);
      }

      if (sectionToAdd) {
        this.pushSection(sectionToAdd.node, sectionToAdd.text);
      }

      if (nodeToAdd) {
        this.pushNode(nodeToAdd.text, nodeToAdd.node);
      }

      if (pushAndClearBufferAfter) {
        this.pushAndClearBuffer();
      }

      if (processorIframeBlocked && nextAfterIframe) {
        this.nodeAfterIframe = nextAfterIframe;
      }

      if (processorIframeBlocked) {
        this.pushAndClearBuffer();
        return {
          out: this.sections,
          iframeBlocked: true,
          end: true,
        };
      }

      nextNode = processorNextNode;
      if (nextNode && this.sections.length < ATTRIBUTES.MISC.MIN_SECTIONS) {
        stack.push(nextNode);
      } else {
        this.pushAndClearBuffer();
      }
    }

    return {
      out: this.sections,
      iframeBlocked,
      end: !nextNode,
    };
  }

}
