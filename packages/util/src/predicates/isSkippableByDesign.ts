type ElementDescriptor = {
  tagName: string;
  attr: string;
  value: string[];
};

const elementsList: ElementDescriptor[] = [
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

function isHTMLElement(node: HTMLElement | Text): node is HTMLElement {
  return node instanceof HTMLElement;
}

export default function isSkippableByDesign(el: HTMLElement | Text): boolean {
  if (!isHTMLElement(el)) {
    return false;
  }

  return elementsList.some(
    (item) =>
      (el.getAttribute(item.attr) || '').indexOf(item.value.join(',')) !== -1
  );
}
