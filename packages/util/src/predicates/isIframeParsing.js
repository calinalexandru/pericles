export default function isIframeParsing(name, iframes) {
  if (name && iframes) return iframes?.[name]?.parsing === true;
  return name?.parsing === true;
}
