export default function getFirstNode(): Node {
  return document?.body?.children?.[0] || document?.body?.childNodes?.[0];
}
