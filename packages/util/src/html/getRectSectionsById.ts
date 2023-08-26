import rectSectionQuerySelector from './rectSectionQuerySelector';

export default function getRectSectionsById(id: string): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(rectSectionQuerySelector(id))
  );
}
