import rectSectionQuerySelector from './rectSectionQuerySelector';

export default function getRectSectionsById(id: number): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(rectSectionQuerySelector(id))
  );
}
