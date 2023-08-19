export default function getLangFromStr(str) {
  let lang = 'en';
  const compoundLangRegex = new RegExp('[a-z]{2}-[a-z]{2}', 'i');
  if (compoundLangRegex.test(str)) lang = str.substring(0, 2);
  else lang = str;
  return lang.toLocaleLowerCase();
}
