export default function getIsoLangFromString(str) {
  if (!str) return false;
  return new RegExp('[a-z]{2}-[a-z]{2}', 'i').test(str)
    ? str.substr(0, 2).toLocaleLowerCase()
    : str.toLocaleLowerCase?.();
}
