export default function getIframeDocument(iframe) {
  return iframe?.contentDocument || iframe?.contentWindow?.document;
}
