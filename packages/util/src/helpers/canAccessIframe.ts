export default function canAccessIframe(iframe: any): Document | boolean {
  let out = false;
  try {
    out = !!(iframe.contentDocument || iframe.contentWindow.document);
  } catch {
    out = false;
  }
  console.log('canAccessIframe', iframe, out);
  return out;
}
