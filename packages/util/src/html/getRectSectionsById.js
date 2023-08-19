import rectSectionQuerySelector from './rectSectionQuerySelector';

export default function getRectSectionsById(id) {
  return Array.from(document.querySelectorAll(rectSectionQuerySelector(id)));
}
