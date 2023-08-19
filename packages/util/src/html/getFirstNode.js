export default function getFirstNode() {
  return document?.body?.children?.[0] || document?.body?.childNodes?.[0];
}
