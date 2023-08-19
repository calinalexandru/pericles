export default function detectBrowserLocale() {
  return navigator?.language?.substring(0, 2) || 'en';
}
