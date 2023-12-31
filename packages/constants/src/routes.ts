export const ROUTES = {
  INDEX: '/index',
  LOGIN: '/login',
  USER: '/user',
  ERROR: '/error',
  ERROR_PDF: '/error_pdf',
  SKIP: '/skip',
} as const;

export type RoutesTypes = typeof ROUTES[keyof typeof ROUTES];
