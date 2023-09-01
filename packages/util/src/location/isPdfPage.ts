export default function isPdfPage(window: Window): boolean {
  return !!window?.location?.href?.match(/\.pdf(\?.*)?$/gi);
}
