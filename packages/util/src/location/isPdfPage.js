export default function isPdfPage(window) {
  return !!window?.location?.href?.match(/\.pdf(\?.*)?$/gi);
}
