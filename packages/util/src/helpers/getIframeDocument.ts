export default function getIframeDocument(iframe: any): Document {
  return iframe?.contentDocument || iframe?.contentWindow?.document;
}
