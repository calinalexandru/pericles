export default function getHostnameFromUrl(str: string): string {
  return new URL(str).hostname;
}
