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
