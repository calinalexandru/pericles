export default function isWikipedia(): boolean {
  return window.location.hostname.indexOf('wikipedia.org') !== -1;
}
