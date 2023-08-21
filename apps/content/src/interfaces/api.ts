export interface MessageRequest {
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
