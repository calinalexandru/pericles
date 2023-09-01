export default function isGoogleDocsDocumentSvg(window: Window): boolean {
  return (
    window.location.hostname === 'docs.google.com' &&
    window.location.pathname.indexOf('/document/') !== -1
  );
}
