export default function getCountryCodeFromString(str) {
  if (!str) return false;
  return new RegExp('[a-z]{2}-[a-z]{2}', 'i').test(str)
    ? str.slice(3).toLocaleUpperCase()
    : str.toLocaleUpperCase?.();
}
