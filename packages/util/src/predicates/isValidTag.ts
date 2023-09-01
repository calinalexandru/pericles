// should only accept node element type
export default function isValidTag(el: HTMLElement) {
  return ![ 'SCRIPT', 'NOSCRIPT', 'LINK', 'STYLE', 'PICTURE', ].includes(
    el.tagName
  );
}
