import React from 'react';

import { ROUTES, } from '@pericles/constants';

export default {
  [ROUTES.INDEX]: React.lazy(() => import('./pages/IndexPage')),
  [ROUTES.ERROR]: React.lazy(() => import('./pages/ErrorPage')),
  [ROUTES.ERROR_PDF]: React.lazy(() => import('./pages/PDFPreviewErrorPage')),
  [ROUTES.SKIP]: React.lazy(() => import('./pages/SkipPage')),
  errorGooglePreview: React.lazy(() =>
    import('./pages/GooglePreviewErrorPage')
  ),
  errorPdfPreview: React.lazy(() => import('./pages/PDFPreviewErrorPage')),
};
