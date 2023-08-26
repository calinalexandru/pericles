import rectSectionQuerySelector from './rectSectionQuerySelector';

export default function getRectSectionsById(id: string): HTMLElement {
  return document.querySelector<HTMLElement>(rectSectionQuerySelector(id));
}
