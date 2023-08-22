export interface MessageRequest {
  activeTab?: {
    id: number;
  };
  message?: {
    payload?: Record<string, any>;
  };
}

export interface Action {
  [key: string]: any;
  payload: {
    iframe: boolean;
  };
}
