export default function canAccessIframe(iframe: any): Document | boolean {
  try {
    console.log('canAccessIframe', iframe, true);
    return iframe.contentDocument || iframe.contentWindow.document;
  } catch {
    console.log('canAccessIframe', iframe, false);
    return false;
  }
}
