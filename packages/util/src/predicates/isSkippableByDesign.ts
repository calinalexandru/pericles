const elementsList = [
  { tagName: 'table', attr: 'class', value: [ 'infobox', ], },
  { tagName: 'table', attr: 'class', value: [ 'vertical-navbox', ], },
  { tagName: 'div', attr: 'role', value: [ 'navigation', ], },
  { tagName: 'div', attr: 'class', value: [ 'reflist', ], },
  { tagName: 'div', attr: 'id', value: [ 'mw-panel', ], },
  { tagName: 'div', attr: 'id', value: [ 'mw-head', ], },
  { tagName: 'div', attr: 'class', value: [ 'thumbcaption', ], },
  { tagName: 'div', attr: 'class', value: [ 'shortdescription', ], },
  { tagName: 'div', attr: 'id', value: [ 'toc', ], },
];

export default function isSkippableByDesign(el: HTMLElement): boolean {
  return elementsList.reduce(
    (acc, cur) =>
      (el.getAttribute(cur.attr) || '').indexOf(cur.value.join(',')) !== -1 ||
      acc,
    false
  );
}
