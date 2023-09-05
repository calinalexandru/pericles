import rectSectionQuerySelector from './rectSectionQuerySelector';

export default function getRectSectionsById(id: number): HTMLElement | null {
  return document.querySelector<HTMLElement>(rectSectionQuerySelector(id));
}
