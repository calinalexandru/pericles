export default function canAccessIframe(iframe: any): Document | boolean {
  try {
    return iframe.contentDocument || iframe.contentWindow.document;
  } catch {
    return false;
  }
}
