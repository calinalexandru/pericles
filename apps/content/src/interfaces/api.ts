export interface MessageRequest {
  activeTab?: {
    id: number;
  };
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
