export default function getCountryCodeFromString(str: string | null): string {
  if (!str) return '';
  return new RegExp('[a-z]{2}-[a-z]{2}', 'i').test(str)
    ? str.slice(3).toLocaleUpperCase()
    : str.toLocaleUpperCase?.();
}
