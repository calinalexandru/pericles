// should only accept node element type
export default function isValidTag(el) {
  return ![ 'SCRIPT', 'NOSCRIPT', 'LINK', 'STYLE', 'PICTURE', ].includes(
    el.tagName
  );
}
