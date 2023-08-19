export default function isGoogleFormsDocument(window) {
  return (
    window.location.hostname === 'docs.google.com' &&
    window.location.pathname.indexOf('/forms/') !== -1
  );
}
