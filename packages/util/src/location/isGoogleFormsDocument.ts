export default function isGoogleFormsDocument(window: Window): boolean {
  return (
    window.location.hostname === 'docs.google.com' &&
    window.location.pathname.indexOf('/forms/') !== -1
  );
}
