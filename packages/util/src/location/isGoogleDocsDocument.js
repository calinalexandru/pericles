export default function isGoogleDocsDocumentSvg(window) {
  return (
    window.location.hostname === 'docs.google.com' &&
    window.location.pathname.indexOf('/document/') !== -1
  );
}
