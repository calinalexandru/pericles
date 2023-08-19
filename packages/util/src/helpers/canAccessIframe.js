export default function canAccessIframe(iframe) {
  try {
    return iframe.contentDocument || iframe.contentWindow.document;
  } catch {
    return false;
  }
}
