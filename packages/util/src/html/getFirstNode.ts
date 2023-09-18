export default function getFirstNode(): Node {
  console.log('getFirstNode');
  return document?.body?.children?.[0] || document?.body?.childNodes?.[0];
}
