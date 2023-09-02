import rectSectionQuerySelector from './rectSectionQuerySelector';

export default function getRectSectionsById(id: number): HTMLElement {
  return document.querySelector<HTMLElement>(rectSectionQuerySelector(id));
}
