import { SectionType, } from '@pericles/constants';

export interface WalkTheDOMResult {
  out: SectionType[];
  iframeBlocked: boolean;
  end: boolean;
}

export interface MessageRequest {
  activeTab?: chrome.tabs.Tab;
  message?: {
    payload?: Record<string, any>;
  };
}

export interface MaybeAction {
  payload: {
    iframe: boolean;
  };
  [key: string]: any;
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
  node: Node | null;
  lastKey: number;
  userGenerated: boolean;
  playFromCursor: number;
  sections: SectionType[];
  sentenceBuffer: SectionType | null;

  // Methods
  reset(): void;
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
  isVisible(node: Node): boolean;
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
