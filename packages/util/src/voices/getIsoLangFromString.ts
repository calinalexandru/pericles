export default function getIsoLangFromString(str: string): string {
  if (!str) return '';
  return new RegExp('[a-z]{2}-[a-z]{2}', 'i').test(str)
    ? str.substr(0, 2).toLocaleLowerCase()
    : str.toLocaleLowerCase?.();
}
