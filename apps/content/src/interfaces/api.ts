import { SectionType, } from '@pericles/constants';

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
}

export interface NodeProcessingStrategy {
  shouldProcess(node: Node, walkerInstance: IDOMWalker): boolean;
  process(node: Node, walkerInstance: IDOMWalker): ProcessResult;
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
  blocked: boolean;
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
  storedNode: Node | null;
  storedIframeNode: Node | null;

  // Methods
  resetSentenceBuffer(): void;
  appendSentenceBuffer(data: {
    top: number;
    width: number;
    height: number;
    text: string;
  }): void;
  pushNode(text: string, node: HTMLElement | Text): void;
  pushSection(node: HTMLElement, text: string): void;
  pushAndClearBuffer(): void;
  walk(): IWalkTheDOMResult;
}
