export default function isGoogleDocsDocumentSvg(window: Window): boolean {
  return (
    window.location.hostname === 'docs.google.com' &&
    window.location.pathname.indexOf('/document/') !== -1 &&
    document.querySelectorAll('.kix-canvas-tile-content svg g')?.length > 0
  );
}
