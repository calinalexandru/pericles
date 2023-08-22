export const ERROR_CODES = {
  PLAYER: {
    HTML: 100,
    WEBSOCKET: 102,
    OVERLOAD: 103,
    TIMEOUT: 104,
    TEXT_EXCEED: 105,
  },
  WEBSOCKET: {
    UNKNOWN: 1000,
    TIMEOUT: 1006,
    THROTTLE: 1007,
  },
} as const;
