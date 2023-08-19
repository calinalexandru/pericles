export default function getHostnameFromUrl(str) {
  try {
    return new URL(str)?.hostname;
  } catch {
    return null;
  }
}
