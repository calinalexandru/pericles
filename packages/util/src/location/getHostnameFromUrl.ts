export default function getHostnameFromUrl(str: string): string {
  try {
    return new URL(str)?.hostname;
  } catch {
    return '';
  }
}
