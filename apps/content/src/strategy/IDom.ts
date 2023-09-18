import {
  ParserIframesType,
  ParserTypes,
  SectionType,
} from '@pericles/constants';

export interface GetSectionsResult {
  out: SectionType[];
  maxPage: number;
  end?: boolean;
  iframeBlocked?: boolean;
  pageIndex?: number;
}

export interface IDomStrategy {
  type: ParserTypes;
  isUserTriggered: boolean;
  verticalStartOffset: number;
  parserKey: number;
  parserIframes: ParserIframesType;
  domWalker: IDOMWalker;

  setup(
    type?: ParserTypes,
    parserKey?: number,
    isUserTriggered?: boolean,
    verticalStartOffset?: number,
    parserIframes?: ParserIframesType
  ): void;

  getSections(): GetSectionsResult;
}

export interface WalkTheDOMResult {
  out: SectionType[];
  iframeBlocked: boolean;
  end: boolean;
}

export interface ProcessResult {
  nextNode: Node | null;
  nextAfterIframe: Node | null;
  iframeBlocked: boolean;
  finalizeSentenceBufferBefore?: boolean;
  finalizeSentenceBufferAfter?: boolean;
  sectionToAdd?: { node: HTMLElement; text: string };
  nodeToAdd?: { node: Text; text: string };
  domAlterations?: (key: number) => void;
}

export interface NodeProcessingStrategy {
  shouldProcess(node: Node, isVisible?: boolean): boolean;
  process(node: Node, isVisible?: boolean): ProcessResult;
}

export interface IPosition {
  top: number;
  width: number;
  height: number;
}

export interface IProcessResult {
  nextNode: Node | null;
  nextAfterIframe: Node | null;
}

export interface IWalkTheDOMResult {
  out: SectionType[];
  end: boolean;
  iframeBlocked: boolean;
}

export interface IWalkTheDOMParams {
  node?: Node;
  lastKey: number;
  userGenerated: boolean;
  playFromCursor: number;
}

export interface IDOMWalker {
  // Properties
  startingNode: Node | null;
  lastDomAlterationId: number;
  isUserTriggered: boolean;
  verticalStartOffset: number;
  sections: SectionType[];
  temporarySentence: SectionType | null;
  domAlterationsBatch: { fn: (key: number) => void; data: number }[];
  continuationNodeAfterIframe: Node | null;
  isVisible: boolean;

  // Methods
  setup(
    startingNode: Node | null,
    lastDomAlterationId: number,
    isUserTriggered: boolean,
    verticalStartOffset: number
  ): void;
  handleNodeAfterIframe(): void;
  pushNextNodeOntoStack(stack: (Node | null)[], nextNode: Node | null): void;
  processBatchedDomAlterations(): void;
  finalizeWalk(
    nextNode: Node | null,
    end?: boolean,
    iframeBlocked?: boolean
  ): WalkTheDOMResult;
  processAndHandleNode(node: Node): {
    nextNode: Node | null;
    iframeBlocked: boolean;
  };
  handleNodeAfterIframe(): void;
  setAndCacheIsVisibleNode(node: Node): void;
  processNode(node: Node): ProcessResult;
  appendSentenceBuffer(data: {
    top: number;
    width: number;
    height: number;
    text: string;
  }): void;
  pushNode(text: string, node: HTMLElement | Text): void;
  pushSection(node: HTMLElement, text: string): void;
  finalizeSentenceBuffer(): void;
  walk(): IWalkTheDOMResult;
}
