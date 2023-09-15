export default function isWindow(obj: unknown): obj is Window {
  return obj instanceof Window;
}
