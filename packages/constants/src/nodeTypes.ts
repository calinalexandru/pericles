export const NODE_TYPES = {
  ELEMENT: 1,
  TEXT: 3,
} as const;
export type NodeTypes = typeof NODE_TYPES[keyof typeof NODE_TYPES];
