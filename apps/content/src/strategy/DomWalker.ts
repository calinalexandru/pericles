/* eslint-disable class-methods-use-this */
import { IDOMWalker, NodeProcessingStrategy, } from '@/interfaces/api';
import { ATTRIBUTES, SectionType, } from '@pericles/constants';
import {
  getPosition,
  getSelfIframes,
  isMinText,
  isNode,
  removeHelperTags,
  sectionQuerySelector,
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

  public storedNode: Node | null = null;

  public storedIframeNode: Node | null = null;

  public sections: SectionType[] = [];

  public results: WalkTheDOMResult[] = [];

  constructor() {
    this.processors = [
      new TextNodeProcessor(),
      new ElementNodeProcessor(),
      new AnyNodeProcessor(),
    ];
  }

  public resetSentenceBuffer() {
    this.sentenceBuffer = null;
  }

  public appendSentenceBuffer({
    top,
    width,
    height,
    text,
  }: {
    top: number;
    width: number;
    height: number;
    text: string;
  }) {
    this.sentenceBuffer = {
      text: `${this.sentenceBuffer?.text || ''}${text}`,
      pos: {
        top,
        width,
        height,
      },
    };
  }

  public pushNode(text: string, node: HTMLElement | Text) {
    const pos = getPosition(node, true);
    const outer = { text, ...pos, };
    this.appendSentenceBuffer(outer);
  }

  public pushSection(node: HTMLElement, text: string) {
    const pos = getPosition(node);
    this.sections.push({ node, text, pos, });
  }

  public pushAndClearBuffer() {
    console.log('DomWalker.pushAndClearBuffer');
    if (this.sentenceBuffer === null) return;

    if (isMinText(this.sentenceBuffer.text)) {
      this.sections.push(this.sentenceBuffer);
    } else {
      const nodesInFrame: HTMLElement[] = getSelfIframes().reduce(
        (acc, iframe) => [
          ...acc,
          ...Array.from(
            iframe.document.querySelectorAll<HTMLElement>(
              sectionQuerySelector(this.lastKey + this.sections.length)
            )
          ),
        ],
        [] as HTMLElement[]
      );
      removeHelperTags(
        Array.from(
          document.querySelectorAll<HTMLElement>(
            sectionQuerySelector(this.lastKey + this.sections.length)
          )
        )
      );
      if (nodesInFrame.length) removeHelperTags(nodesInFrame);
    }
    this.sentenceBuffer = null;
  }

  walk(): WalkTheDOMResult {
    const stack: (Node | null)[] = [ this.node, ];
    let nextNode: Node | null = null;
    let iframeBlocked = false;
    while (stack.length) {
      const node = stack.pop();
      console.log('DomWalker.walk', node);
      let nextAfterIframe: Node | null = null;

      if (!isNode(node)) {
        this.pushAndClearBuffer();
        return {
          iframeBlocked: false,
          out: this.sections,
          end: true,
        };
      }

      for (const processor of this.processors) {
        if (processor.shouldProcess(node, this)) {
          ({ nextNode, nextAfterIframe, iframeBlocked, } = processor.process(
            node,
            this
          ));
          break;
        }
      }

      console.log('DomWalker.walk.nextNode', nextNode);

      if (iframeBlocked && this.storedIframeNode) {
        nextNode = this.storedIframeNode;
        this.storedIframeNode = null;
      }

      if (nextAfterIframe && !this.storedIframeNode) {
        this.storedIframeNode = nextAfterIframe;
        nextAfterIframe = null;
      }

      if (nextNode) {
        this.storedNode = nextNode;
        if (this.sections.length < ATTRIBUTES.MISC.MIN_SECTIONS) {
          console.log('DomWalker.walk stackPush.nextNode', nextNode);
          stack.push(nextNode);
        }
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
